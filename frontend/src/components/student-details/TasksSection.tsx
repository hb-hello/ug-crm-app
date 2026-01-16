import { Box, Heading, VStack, Card, Text, Badge, HStack, Button } from '@chakra-ui/react';
import { Task } from 'crm-shared';
import { FiClock, FiEdit2 } from 'react-icons/fi';

interface TasksSectionProps {
    tasks: Task[];
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'gray',
    in_progress: 'blue',
    completed: 'green',
    overdue: 'red',
};

export function TasksSection({ tasks }: TasksSectionProps) {
    return (
        <Box bg="white" shadow="sm" rounded="lg" p={6}>
            <Heading size="md" mb={4}>Tasks</Heading>
            {tasks.length === 0 ? (
                <Text color="gray.500">No tasks found.</Text>
            ) : (
                <VStack align="stretch" gap={4}>
                    {tasks.map(task => (
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
                                            <Text>Assigned: {task.assignedTo}</Text>
                                        </HStack>
                                    </Box>
                                    <HStack>
                                        <Badge colorPalette={STATUS_COLORS[task.status]}>
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                        <Button size="xs" variant="ghost">
                                            <FiEdit2 />
                                        </Button>
                                    </HStack>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </VStack>
            )}
        </Box>
    );
}
