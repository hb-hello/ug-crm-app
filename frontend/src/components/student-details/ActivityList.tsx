import { Box, Heading, VStack, Text, Card, HStack, Badge } from '@chakra-ui/react';
import { Interaction } from 'crm-shared';

interface ActivityListProps {
    interactions: Interaction[];
}

export function ActivityList({ interactions }: ActivityListProps) {
    return (
        <Box bg="white" shadow="sm" rounded="lg" p={6} h="full">
            <Heading size="md" mb={4}>Student Activity</Heading>
            <VStack align="stretch" gap={3}>
                {interactions.map((interaction) => (
                    <Card.Root key={interaction.id} size="sm" variant="subtle">
                        <Card.Body py={3}>
                            <HStack justify="space-between" mb={1}>
                                <Badge variant="surface" colorPalette="gray">
                                    {interaction.type}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                    {new Date(interaction.timestamp).toLocaleString()}
                                </Text>
                            </HStack>
                            {interaction.metadata && (
                                <Text fontSize="sm" color="gray.600">
                                    {Object.entries(interaction.metadata)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(', ')}
                                </Text>
                            )}
                        </Card.Body>
                    </Card.Root>
                ))}
                {interactions.length === 0 && (
                    <Text color="gray.500" fontSize="sm">No activity recorded.</Text>
                )}
            </VStack>
        </Box>
    );
}
