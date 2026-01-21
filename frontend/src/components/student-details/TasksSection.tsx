import { Box, Heading, VStack, Card, Text, Badge, HStack, Button, Menu } from '@chakra-ui/react';
import { Task } from 'crm-shared';
import { FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useUserStore } from '@/store/userStore';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { useState } from 'react';

interface TasksSectionProps {
    tasks: Task[];
    studentId?: string; // Optional for invalidation scoping, but we can invalidate generic 'tasks'
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'gray',
    in_progress: 'blue',
    completed: 'green',
    overdue: 'red',
};

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    // overdue is usually automatic, but allowing manual set
    { value: 'overdue', label: 'Overdue' },
];

export function TasksSection({ tasks }: TasksSectionProps) {
    const queryClient = useQueryClient();
    const { usersMap, currentUser } = useUserStore();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
            return api.patch(`/tasks/${taskId}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            // Also invalidate student stats if needed?
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (taskId: string) => {
            return api.delete(`/tasks/${taskId}`);
        },
        onSuccess: () => {
            setDeletingId(null);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const confirmDelete = () => {
        if (deletingId) {
            deleteMutation.mutate(deletingId);
        }
    };

    return (
        <Box bg="white" shadow="sm" rounded="lg" p={6}>
            <Heading size="md" mb={4}>Tasks</Heading>
            {tasks.length === 0 ? (
                <Text color="gray.500">No tasks found.</Text>
            ) : (
                <VStack align="stretch" gap={4}>
                    {tasks.map(task => {
                        const assignedToName = usersMap[task.assignedTo] || task.assignedTo;
                        const createdByName = usersMap[task.createdBy] || task.createdBy;

                        // Allow edit if current user is assignee or creator
                        const canEdit = currentUser?.uid === task.assignedTo || currentUser?.uid === task.createdBy;

                        return (
                            <Card.Root key={task.id} size="sm" variant="outline">
                                <Card.Body>
                                    <HStack justify="space-between">
                                        <Box>
                                            <Text fontWeight="medium" mb={1}>{task.description}</Text>
                                            <HStack gap={4} fontSize="sm" color="gray.500">
                                                <HStack>
                                                    <FiClock />
                                                    <Text>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
                                                </HStack>
                                                <Text>Assigned To: {assignedToName}</Text>
                                                <Text>By: {createdByName}</Text>
                                            </HStack>
                                        </Box>
                                        <HStack>
                                            <Badge colorPalette={STATUS_COLORS[task.status]}>
                                                {task.status.replace('_', ' ')}
                                            </Badge>

                                            {canEdit && (
                                                <HStack gap={1}>
                                                    <Menu.Root>
                                                        <Menu.Trigger asChild>
                                                            <Button size="xs" h={6} w={6} minW={0} p={0} variant="ghost" loading={mutation.isPending}>
                                                                <FiEdit2 />
                                                            </Button>
                                                        </Menu.Trigger>
                                                        <Menu.Positioner>
                                                            <Menu.Content>
                                                                {STATUS_OPTIONS.map(option => (
                                                                    <Menu.Item
                                                                        key={option.value}
                                                                        value={option.value}
                                                                        onClick={() => mutation.mutate({ taskId: task.id, status: option.value })}
                                                                    >
                                                                        {option.label}
                                                                    </Menu.Item>
                                                                ))}
                                                            </Menu.Content>
                                                        </Menu.Positioner>
                                                    </Menu.Root>
                                                    <Button
                                                        size="xs"
                                                        h={6} w={6} minW={0} p={0}
                                                        variant="ghost"
                                                        colorPalette="red"
                                                        onClick={() => setDeletingId(task.id)}
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                </HStack>
                                            )}
                                        </HStack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                        );
                    })}
                </VStack>
            )}

            <ConfirmationDialog
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                isLoading={deleteMutation.isPending}
            />
        </Box>
    );
}
