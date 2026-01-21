import { Box, Heading, VStack, Text, Card, HStack, Badge, Icon } from '@chakra-ui/react';
import { Interaction, InteractionType } from 'crm-shared';
import { FiSmartphone, FiMonitor, FiTablet, FiLogIn, FiMessageCircle, FiUpload, FiDownload } from 'react-icons/fi';

// Device icons mapping
const DEVICE_ICONS: Record<string, typeof FiSmartphone> = {
    mobile: FiSmartphone,
    desktop: FiMonitor,
    tablet: FiTablet,
};

// Interaction type icons and colors
const TYPE_CONFIG: Record<InteractionType, { icon: typeof FiLogIn; color: string }> = {
    'login': { icon: FiLogIn, color: 'green' },
    'AI question': { icon: FiMessageCircle, color: 'purple' },
    'document upload': { icon: FiUpload, color: 'blue' },
    'document download': { icon: FiDownload, color: 'teal' },
};

interface ActivityListProps {
    interactions: Interaction[];
}

export function ActivityList({ interactions }: ActivityListProps) {
    const formatPage = (page: string) => {
        // Capitalize first letter and add "page" suffix
        const pageName = page.charAt(0).toUpperCase() + page.slice(1);
        return `${pageName} page`;
    };

    return (
        <Box bg="white" shadow="sm" rounded="lg" p={6} h="full">
            <Heading size="md" mb={4}>Student Activity</Heading>
            <VStack align="stretch" gap={3}>
                {interactions.map((interaction) => {
                    const typeConfig = TYPE_CONFIG[interaction.type] || { icon: FiLogIn, color: 'gray' };
                    const DeviceIcon = interaction.metadata?.device ? DEVICE_ICONS[interaction.metadata.device] : null;

                    return (
                        <Card.Root key={interaction.id} size="sm" variant="subtle">
                            <Card.Body py={3}>
                                {/* Type badge and timestamp */}
                                <HStack justify="space-between" mb={2}>
                                    <Badge variant="surface" colorPalette={typeConfig.color}>
                                        <Icon as={typeConfig.icon} mr={1} />
                                        {interaction.type}
                                    </Badge>
                                    <Text fontSize="xs" color="gray.500">
                                        {new Date(interaction.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                    </Text>
                                </HStack>

                                {/* Description */}
                                {interaction.description && (
                                    <Text fontSize="sm" fontWeight="medium" mb={2} textAlign="left">
                                        {interaction.description}
                                    </Text>
                                )}

                                {/* Metadata: Device icon and Page */}
                                {interaction.metadata && (
                                    <HStack fontSize="xs" color="gray.500" gap={3}>
                                        {DeviceIcon && (
                                            <HStack gap={1}>
                                                <Icon as={DeviceIcon} />
                                            </HStack>
                                        )}
                                        {interaction.metadata.page && (
                                            <Text>{formatPage(interaction.metadata.page)}</Text>
                                        )}
                                    </HStack>
                                )}
                            </Card.Body>
                        </Card.Root>
                    );
                })}
                {interactions.length === 0 && (
                    <Text color="gray.500" fontSize="sm">No activity recorded.</Text>
                )}
            </VStack>
        </Box>
    );
}
