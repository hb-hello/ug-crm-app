import { Box, Heading, VStack, Text, HStack, Icon, Circle } from '@chakra-ui/react';
import { Communication } from 'crm-shared';
import { FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

interface CommunicationsTimelineProps {
    communications: Communication[];
}

const CHANNEL_ICONS = {
    call: FiPhone,
    email: FiMail,
    sms: FiMessageSquare,
};

const CHANNEL_COLORS = {
    call: 'green',
    email: 'blue',
    sms: 'purple',
};

export function CommunicationsTimeline({ communications }: CommunicationsTimelineProps) {
    return (
        <Box bg="white" shadow="sm" rounded="lg" p={6} h="full">
            <Heading size="md" mb={4}>Communications</Heading>
            <VStack align="stretch" gap={6} position="relative" pl={2}>
                {/* Vertical Line */}
                <Box
                    position="absolute"
                    left="19px"
                    top={2}
                    bottom={2}
                    w="2px"
                    bg="gray.200"
                    zIndex={0}
                />

                {communications.map((comm) => (
                    <HStack key={comm.id} align="start" gap={4} zIndex={1} position="relative">
                        <Circle size="30px" bg={`${CHANNEL_COLORS[comm.channel]}.100`} color={`${CHANNEL_COLORS[comm.channel]}.600`}>
                            <Icon as={CHANNEL_ICONS[comm.channel]} size="sm" />
                        </Circle>
                        <Box flex={1} bg="white" p={3} rounded="md" shadow="xs" border="1px solid" borderColor="gray.100">
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                                {comm.summary}
                            </Text>
                            <HStack justify="space-between" fontSize="xs" color="gray.500">
                                <Text>By: {comm.loggedBy}</Text>
                                <Text>{new Date(comm.timestamp).toLocaleString()}</Text>
                            </HStack>
                        </Box>
                    </HStack>
                ))}
                {communications.length === 0 && (
                    <Text color="gray.500" fontSize="sm" ml={10}>No communications logged.</Text>
                )}
            </VStack>
        </Box>
    );
}
