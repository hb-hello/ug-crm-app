import { Box, Heading, VStack, Text, Textarea, Button, HStack, Avatar } from '@chakra-ui/react';
import { Note } from 'crm-shared';

interface NotesSectionProps {
    notes: Note[];
}

export function NotesSection({ notes }: NotesSectionProps) {
    return (
        <Box bg="white" shadow="sm" rounded="lg" p={6}>
            <Heading size="md" mb={4}>Notes</Heading>

            <VStack align="stretch" gap={6}>
                <Box>
                    <Textarea placeholder="Add a note..." rows={3} mb={2} bg="white" />
                    <HStack justify="flex-end">
                        <Button size="sm" colorPalette="blue">Add Note</Button>
                    </HStack>
                </Box>

                {notes.map(note => (
                    <Box key={note.id} bg="yellow.50" p={4} rounded="md" border="1px solid" borderColor="yellow.200">
                        <Text mb={2} whiteSpace="pre-wrap">{note.content}</Text>
                        <HStack fontSize="xs" color="gray.500" justify="space-between">
                            <HStack>
                                <Avatar.Root size="2xs">
                                    <Avatar.Fallback name={note.createdBy} />
                                </Avatar.Root>
                                <Text>{note.createdBy}</Text>
                            </HStack>
                            <Text>{new Date(note.createdAt).toLocaleString()}</Text>
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
