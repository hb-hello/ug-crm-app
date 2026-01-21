import { Box, Heading, VStack, Text, Textarea, Button, HStack, Avatar } from '@chakra-ui/react';
import { Note } from 'crm-shared';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useUserStore } from '@/store/userStore';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

interface NotesSectionProps {
    notes: Note[];
    studentId?: string;
}

export function NotesSection({ notes, studentId }: NotesSectionProps) {
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const { currentUser, usersMap } = useUserStore();

    const createMutation = useMutation({
        mutationFn: async (newContent: string) => {
            if (!studentId) throw new Error('Student ID is missing');
            return api.post('/notes', { studentId, content: newContent });
        },
        onSuccess: () => {
            setContent('');
            queryClient.invalidateQueries({ queryKey: ['notes', studentId] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, content }: { id: string; content: string }) => {
            return api.patch(`/notes/${id}`, { content });
        },
        onSuccess: () => {
            setEditingId(null);
            queryClient.invalidateQueries({ queryKey: ['notes', studentId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/notes/${id}`);
        },
        onSuccess: () => {
            setDeletingId(null);
            queryClient.invalidateQueries({ queryKey: ['notes', studentId] });
        },
    });

    const handleAddNote = () => {
        if (!content.trim() || !studentId) return;
        createMutation.mutate(content);
    };

    const startEditing = (note: Note) => {
        setEditingId(note.id);
        setEditContent(note.content);
    };

    const saveEdit = () => {
        if (!editingId || !editContent.trim()) return;
        updateMutation.mutate({ id: editingId, content: editContent });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const confirmDelete = () => {
        if (deletingId) {
            deleteMutation.mutate(deletingId);
        }
    };

    return (
        <Box bg="white" shadow="sm" rounded="lg" p={6}>
            <Heading size="md" mb={4}>Notes</Heading>

            <VStack align="stretch" gap={6}>
                <Box>
                    <Textarea
                        placeholder="Add a note..."
                        rows={3}
                        mb={2}
                        bg="white"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <HStack justify="flex-end">
                        <Button
                            size="sm"
                            colorPalette="blue"
                            onClick={handleAddNote}
                            loading={createMutation.isPending}
                            disabled={!content.trim() || !studentId}
                        >
                            Add Note
                        </Button>
                    </HStack>
                </Box>

                {notes.map(note => {
                    const isOwner = currentUser?.uid === note.createdBy;

                    const creatorName = usersMap[note.createdBy] || note.createdBy;
                    const isEditing = editingId === note.id;

                    return (
                        <Box key={note.id} bg="gray.50" p={4} rounded="md" border="1px solid" borderColor="gray.200">
                            {isEditing ? (
                                <Box>
                                    <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        bg="white"
                                        rows={3}
                                        mb={2}
                                    />
                                    <HStack justify="flex-end" gap={2}>
                                        <Button size="xs" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                                        <Button size="xs" colorPalette="blue" onClick={saveEdit} loading={updateMutation.isPending}>Save</Button>
                                    </HStack>
                                </Box>
                            ) : (
                                <>
                                    <HStack justify="space-between" align="start" mb={2}>
                                        <Text whiteSpace="pre-wrap" flex="1" textAlign="left">{note.content}</Text>
                                        {isOwner && (
                                            <HStack gap={1}>
                                                <Button
                                                    size="xs" h={6} w={6} minW={0} p={0}
                                                    variant="ghost"
                                                    onClick={() => startEditing(note)}
                                                    aria-label="Edit note"
                                                >
                                                    <FiEdit2 />
                                                </Button>
                                                <Button
                                                    size="xs" h={6} w={6} minW={0} p={0}
                                                    variant="ghost"
                                                    colorPalette="red"
                                                    onClick={() => setDeletingId(note.id)}
                                                    aria-label="Delete note"
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </HStack>
                                        )}
                                    </HStack>
                                    <HStack fontSize="xs" color="gray.500" justify="space-between">
                                        <HStack>
                                            <Avatar.Root size="2xs">
                                                <Avatar.Fallback name={creatorName} />
                                            </Avatar.Root>
                                            <Text>{creatorName}</Text>
                                        </HStack>
                                        <Text>{new Date(note.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</Text>
                                    </HStack>
                                </>
                            )}
                        </Box>
                    );
                })}
                {notes.length === 0 && (
                    <Text color="gray.500">No notes yet.</Text>
                )}
            </VStack>

            <ConfirmationDialog
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Note"
                description="Are you sure you want to delete this note? This action cannot be undone."
                isLoading={deleteMutation.isPending}
            />
        </Box>
    );
}
