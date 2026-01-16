import { Card, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Student } from 'crm-shared';

const STATUS_COLORS: Record<Student['applicationStatus'], string> = {
    Prospect: 'gray',
    Applying: 'blue',
    Submitted: 'purple',
    Admitted: 'green',
    Rejected: 'red',
    Enrolled: 'teal',
};

const STATUS_ORDER: Student['applicationStatus'][] = [
    'Prospect',
    'Applying',
    'Submitted',
    'Admitted',
    'Rejected',
    'Enrolled',
];

interface HeaderStatsProps {
    summary?: {
        total: number;
        Prospect: number;
        Applying: number;
        Submitted: number;
        Admitted: number;
        Rejected: number;
        Enrolled: number;
    };
}

export function HeaderStats({ summary }: HeaderStatsProps) {
    return (
        <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} gap={4} mb={6}>
            <Card.Root>
                <Card.Body>
                    <VStack align="start" gap={1}>
                        <Text fontSize="sm" color="gray.500">
                            Total
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold">
                            {summary?.total ?? 0}
                        </Text>
                    </VStack>
                </Card.Body>
            </Card.Root>

            {STATUS_ORDER.map((s) => (
                <Card.Root key={s}>
                    <Card.Body>
                        <VStack align="start" gap={1}>
                            <Text fontSize="sm" color="gray.500">
                                {s}
                            </Text>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={`${STATUS_COLORS[s]}.500`}
                            >
                                {summary?.[s] ?? 0}
                            </Text>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            ))}
        </SimpleGrid>
    );
}
