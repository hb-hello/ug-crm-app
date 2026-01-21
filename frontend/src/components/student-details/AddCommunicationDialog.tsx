import { Box, VStack, Text, HStack, Icon, IconButton, Button, Input, Textarea, Dialog, Portal } from '@chakra-ui/react';
import { CommunicationChannel } from 'crm-shared';
import { FiPhone, FiMail, FiMessageSquare, FiPlus, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { auth } from '@/services/firebase';

// Channel options with icons and colors
const CHANNEL_OPTIONS: { value: CommunicationChannel; label: string; icon: typeof FiPhone; color: string }[] = [
    { value: 'call', label: 'Call', icon: FiPhone, color: 'green' },
    { value: 'email', label: 'Email', icon: FiMail, color: 'blue' },
    { value: 'sms', label: 'SMS', icon: FiMessageSquare, color: 'purple' },
];

interface AddCommunicationDialogProps {
    studentId?: string;
}

export function AddCommunicationDialog({ studentId }: AddCommunicationDialogProps) {
    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState<CommunicationChannel>('call');
    const [summary, setSummary] = useState('');
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
    const queryClient = useQueryClient();

    const currentUserEmail = auth.currentUser?.email || 'Unknown';

    const mutation = useMutation({
        mutationFn: async (data: { channel: CommunicationChannel; summary: string; timestamp: string }) => {
            if (!studentId) throw new Error('Student ID is missing');
            return api.post('/communications', {
                studentId,
                channel: data.channel,
                summary: data.summary,
                timestamp: data.timestamp,
                loggedBy: currentUserEmail,
            });
        },
        onSuccess: () => {
            setOpen(false);
            resetForm();
            queryClient.invalidateQueries({ queryKey: ['communications', studentId] });
        },
    });

    const resetForm = () => {
        setChannel('call');
        setSummary('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime(new Date().toTimeString().slice(0, 5));
    };

    const handleSubmit = () => {
        if (!summary.trim() || !studentId) return;
        const timestamp = new Date(`${date}T${time}`).toISOString();
        mutation.mutate({ channel, summary, timestamp });
    };

    return (
        <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
            <Dialog.Trigger asChild>
                <IconButton
                    aria-label="Add communication"
                    size="sm"
                    variant="ghost"
                    colorPalette="blue"
                >
                    <FiPlus />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Log Communication</Dialog.Title>
                            <Dialog.CloseTrigger asChild position="absolute" top={2} right={2}>
                                <IconButton aria-label="Close" size="sm" variant="ghost">
                                    <FiX />
                                </IconButton>
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack gap={4} align="stretch">
                                {/* Channel Pill Buttons */}
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={2}>Channel</Text>
                                    <HStack gap={2}>
                                        {CHANNEL_OPTIONS.map((option) => (
                                            <Button
                                                key={option.value}
                                                size="sm"
                                                variant={channel === option.value ? 'solid' : 'outline'}
                                                colorPalette={option.color}
                                                onClick={() => setChannel(option.value)}
                                                flex={1}
                                            >
                                                <Icon as={option.icon} mr={1} />
                                                {option.label}
                                            </Button>
                                        ))}
                                    </HStack>
                                </Box>

                                {/* Summary */}
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={2}>Summary</Text>
                                    <Textarea
                                        placeholder="Enter communication summary..."
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        rows={3}
                                    />
                                </Box>

                                {/* Date and Time */}
                                <HStack gap={4}>
                                    <Box flex={1}>
                                        <Text fontSize="sm" fontWeight="medium" mb={2}>Date</Text>
                                        <Input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </Box>
                                    <Box flex={1}>
                                        <Text fontSize="sm" fontWeight="medium" mb={2}>Time</Text>
                                        <Input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </Box>
                                </HStack>

                                {/* By Field (Read-only) */}
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={2}>By</Text>
                                    <Input
                                        value={currentUserEmail}
                                        readOnly
                                        bg="gray.50"
                                        cursor="not-allowed"
                                    />
                                </Box>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette="blue"
                                onClick={handleSubmit}
                                loading={mutation.isPending}
                                disabled={!summary.trim() || !studentId}
                            >
                                Save
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
