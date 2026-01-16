import {
    Box,
    Button,
    Card,
    Flex,
    HStack,
    Spinner,
    Table,
    Text,
    VStack,
    Badge,
} from '@chakra-ui/react';
import { Student } from 'crm-shared';

const STATUS_COLORS: Record<Student['applicationStatus'], string> = {
    Prospect: 'gray',
    Applying: 'blue',
    Submitted: 'purple',
    Admitted: 'green',
    Rejected: 'red',
    Enrolled: 'teal',
};

function formatDate(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

interface StudentTableProps {
    students: Student[];
    isLoading: boolean;
    isError: boolean;
    onRowClick: (studentId: string) => void;
    onNext: () => void;
    onPrev: () => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export function StudentTable({
    students,
    isLoading,
    isError,
    onRowClick,
    onNext,
    onPrev,
    hasNextPage,
    hasPrevPage,
}: StudentTableProps) {
    if (isLoading) {
        return (
            <Card.Root>
                <Card.Body>
                    <Flex justify="center" align="center" minH="400px">
                        <VStack gap={4}>
                            <Spinner size="xl" color="blue.500" />
                            <Text color="gray.500">Loading students...</Text>
                        </VStack>
                    </Flex>
                </Card.Body>
            </Card.Root>
        );
    }

    if (isError) {
        return (
            <Card.Root>
                <Card.Body>
                    <Flex justify="center" align="center" minH="400px">
                        <VStack gap={4}>
                            <Text fontSize="xl" fontWeight="medium" color="red.500">
                                Error loading students
                            </Text>
                            <Text color="gray.500">Please try again later</Text>
                        </VStack>
                    </Flex>
                </Card.Body>
            </Card.Root>
        );
    }

    if (!students || students.length === 0) {
        return (
            <Card.Root>
                <Card.Body>
                    <Flex justify="center" align="center" minH="400px">
                        <VStack gap={4}>
                            <Text fontSize="xl" fontWeight="medium" color="gray.500">
                                No students found
                            </Text>
                            <Text color="gray.400">Try adjusting your filters or search terms</Text>
                        </VStack>
                    </Flex>
                </Card.Body>
            </Card.Root>
        );
    }

    return (
        <Card.Root>
            <Card.Body>
                <Box overflowX="auto">
                    <Table.Root variant="line" size="md">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Student ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Email</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Tags</Table.ColumnHeader>
                                <Table.ColumnHeader>Last Active</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {students.map((student) => (
                                <Table.Row
                                    key={student.id}
                                    onClick={() => onRowClick(student.studentId)}
                                    cursor="pointer"
                                    _hover={{ bg: 'gray.50' }}
                                    transition="background 0.2s"
                                >
                                    <Table.Cell color="gray.500" fontSize="xs" fontWeight="bold">
                                        {student.studentId}
                                    </Table.Cell>
                                    <Table.Cell fontWeight="medium">{student.name}</Table.Cell>
                                    <Table.Cell color="gray.600">{student.email}</Table.Cell>
                                    <Table.Cell>
                                        <Badge colorScheme={STATUS_COLORS[student.applicationStatus]}>
                                            {student.applicationStatus}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack wrap="wrap" gap={1}>
                                            {student.tags.slice(0, 3).map((tag) => (
                                                <Badge key={tag} size="sm" colorScheme="purple">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {student.tags.length > 3 && (
                                                <Badge size="sm" colorScheme="gray">
                                                    +{student.tags.length - 3}
                                                </Badge>
                                            )}
                                        </HStack>
                                    </Table.Cell>
                                    <Table.Cell color="gray.600">{formatDate(student.lastActive)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>

                {/* Pagination */}
                <Flex justify="space-between" align="center" mt={4} pt={4} borderTopWidth="1px">
                    <Button onClick={onPrev} disabled={!hasPrevPage} variant="outline">
                        Previous
                    </Button>

                    <Text color="gray.500" fontSize="sm">
                        Showing {students.length} students
                    </Text>

                    <Button onClick={onNext} disabled={!hasNextPage} variant="outline">
                        Next
                    </Button>
                </Flex>
            </Card.Body>
        </Card.Root>
    );
}
