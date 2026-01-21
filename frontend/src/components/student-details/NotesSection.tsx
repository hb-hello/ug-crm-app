import { Box, Heading, VStack, Text, Textarea, Button, HStack, Avatar } from '@chakra-ui/react';
import { Note } from 'crm-shared';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

interface NotesSectionProps {
    notes: Note[];
    studentId?: string;
}

export function NotesSection({ notes, studentId }: NotesSectionProps) {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newContent: string) => {
            if (!studentId) throw new Error('Student ID is missing');
            return api.post('/notes', { studentId, content: newContent });
        },
        onSuccess: () => {
            setContent('');
            queryClient.invalidateQueries({ queryKey: ['notes', studentId] });
        },
    });

    const handleAddNote = () => {
        if (!content.trim() || !studentId) return;
        mutation.mutate(content);
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
                            loading={mutation.isPending}
                            disabled={!content.trim() || !studentId}
                        >
                            Add Note
                        </Button>
                    </HStack>
                </Box>

                {notes.map(note => (
                    <Box key={note.id} bg="gray.50" p={4} rounded="md" border="1px solid" borderColor="gray.200">
                        <Text mb={2} whiteSpace="pre-wrap">{note.content}</Text>
                        <HStack fontSize="xs" color="gray.500" justify="space-between">
                            <HStack>
                                <Avatar.Root size="2xs">
                                    <Avatar.Fallback name={note.createdBy} />
                                </Avatar.Root>
                                <Text>{note.createdBy}</Text>
                            </HStack>
                            <Text>{new Date(note.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</Text>
                        </HStack>
                    </Box>
                ))}
                {notes.length === 0 && (
                    <Text color="gray.500">No notes yet.</Text>
                )}
            </VStack>
        </Box>
    );
}
