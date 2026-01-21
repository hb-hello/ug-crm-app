import { Box, Grid, Heading, Badge, Text, HStack, Link, Icon } from '@chakra-ui/react';
import { Student } from 'crm-shared';
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiTag, FiBook } from 'react-icons/fi';

interface ProfileSectionProps {
    student: Student;
}

const STATUS_COLORS: Record<Student['applicationStatus'], string> = {
    Prospect: 'gray',
    Applying: 'blue',
    Submitted: 'yellow',
    Admitted: 'green',
    Rejected: 'red',
    Enrolled: 'teal',
};

export function ProfileSection({ student }: ProfileSectionProps) {
    const statusColor = STATUS_COLORS[student.applicationStatus] || 'gray';

    return (
        <Box bg="white" shadow="sm" rounded="lg" p={6}>
            <HStack justify="space-between" mb={6} align="start">
                <Box>
                    <Heading size="xl" mb={1}>{student.name}</Heading>
                    <Text color="gray.500" fontSize="sm" textAlign="left">ID: {student.studentId}</Text>
                </Box>
                <Badge colorPalette={statusColor} size="lg" variant="solid">
                    {student.applicationStatus}
                </Badge>
            </HStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(2, 1fr)" }} gap={6}>
                <HStack align="center">
                    <HStack color="gray.500" w="32">
                        <Icon as={FiMail} />
                        <Text fontSize="sm">Email</Text>
                    </HStack>
                    <Link href={`mailto:${student.email}`} color="blue.600" fontWeight="medium">
                        {student.email}
                    </Link>
                </HStack>

                <HStack align="center">
                    <HStack color="gray.500" w="32">
                        <Icon as={FiPhone} />
                        <Text fontSize="sm">Phone</Text>
                    </HStack>
                    <Text fontWeight="medium">{student.phone}</Text>
                </HStack>

                <HStack align="center">
                    <HStack color="gray.500" w="32">
                        <Icon as={FiMapPin} />
                        <Text fontSize="sm">Country</Text>
                    </HStack>
                    <Text fontWeight="medium">{student.country}</Text>
                </HStack>

                <HStack align="center">
                    <HStack color="gray.500" w="32">
                        <Icon as={FiBook} />
                        <Text fontSize="sm">Grade</Text>
                    </HStack>
                    <Text fontWeight="medium">{student.grade}</Text>
                </HStack>

                <HStack align="start" gridColumn={{ md: "span 2" }}>
                    <HStack color="gray.500" w="32">
                        <Icon as={FiTag} />
                        <Text fontSize="sm">Tags</Text>
                    </HStack>
                    <HStack wrap="wrap" gap={2}>
                        {student.tags.map(tag => (
                            <Badge key={tag} variant="subtle" colorPalette="blue">
                                {tag}
                            </Badge>
                        ))}
                    </HStack>
                </HStack>

                <HStack align="center">
                    <HStack color="gray.500" w="32">
                        <Icon as={FiCalendar} />
                        <Text fontSize="sm">Last Active</Text>
                    </HStack>
                    <Text fontWeight="medium">
                        {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'N/A'}
                    </Text>
                </HStack>
            </Grid>
        </Box>
    );
}
