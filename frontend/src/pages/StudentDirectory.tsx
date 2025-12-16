import {
  Box,
  Spinner,
  Text,
  Table,
  Input,
  Button,
  Flex,
  Stack,
  Heading,
  Card,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from 'crm-shared';
import { api } from '@/services/api';
import { useUserStore } from '@/store/userStore';
import { TagMultiSelect } from '@/components/common/TagMultiSelect';

interface StudentResponse {
  students: Student[];
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
    previousCursor?: string;
  };
  summary: {
    total: number;
    prospect: number;
    applying: number;
    submitted: number;
    admitted: number;
    rejected: number;
    enrolled: number;
  };
}

const statuses: Student['applicationStatus'][] = [
  'applying',
  'submitted',
  'admitted',
  'rejected',
  'enrolled',
];

const STATUS_COLORS: Record<Student['applicationStatus'], string> = {
  prospect: 'gray',
  applying: 'blue',
  submitted: 'purple',
  admitted: 'green',
  rejected: 'red',
  enrolled: 'teal',
};

export default function StudentDirectory() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [country, setCountry] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]); // For Prev button
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);

  const { data, isLoading, isError, isFetching } = useQuery<StudentResponse>({
    queryKey: ['students', { search, status, country, tags, cursor }],
    queryFn: async () => {
      const response = await api.get('/students', {
        params: {
          search,
          status,
          country,
          tags: tags.join(','),
          cursor,
        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData, // Replaces keepPreviousData
    enabled: !!currentUser, // Only run query when user is authenticated
  });

  const handleNext = () => {
    if (data?.pagination.nextCursor) {
      if (cursor) {
        setPrevCursors((prev) => [...prev, cursor]);
      }
      setCursor(data.pagination.nextCursor);
    }
  };

  const handlePrev = () => {
    const newPrevCursors = [...prevCursors];
    const prevCursor = newPrevCursors.pop();
    setPrevCursors(newPrevCursors);
    setCursor(prevCursor);
  };

  const handleRowClick = (id: string) => {
    navigate(`/students/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box p={8}>
      <Heading size="2xl" mb={6}>
        Student Directory
      </Heading>

      {/* Summary Metrics */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap={4} mb={6}>
        <Card.Root>
          <Card.Body>
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.500">
                Total
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {data?.summary.total ?? 0}
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>

        {statuses.map((s) => (
          <Card.Root key={s}>
            <Card.Body>
              <VStack align="start" gap={1}>
                <Text fontSize="sm" color="gray.500" textTransform="capitalize">
                  {s}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={`${STATUS_COLORS[s]}.500`}>
                  {data?.summary[s] ?? 0}
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>

      {/* Filters */}
      <Card.Root mb={6}>
        <Card.Body>
          <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
            />

            <NativeSelectRoot size="lg">
              <NativeSelectField
                placeholder="Filter by country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </NativeSelectField>
            </NativeSelectRoot>

            <NativeSelectRoot size="lg">
              <NativeSelectField
                placeholder="Filter by status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>

            <TagMultiSelect value={tags} onChange={setTags} />
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Table */}
      <Card.Root>
        <Card.Body>
          {isLoading || isFetching ? (
            <Flex justify="center" align="center" minH="400px">
              <VStack gap={4}>
                <Spinner size="xl" color="blue.500" />
                <Text color="gray.500">Loading students...</Text>
              </VStack>
            </Flex>
          ) : isError ? (
            <Flex justify="center" align="center" minH="400px">
              <VStack gap={4}>
                <Text fontSize="xl" fontWeight="medium" color="red.500">
                  Error loading students
                </Text>
                <Text color="gray.500">Please try again later</Text>
              </VStack>
            </Flex>
          ) : !data?.students || data.students.length === 0 ? (
            <Flex justify="center" align="center" minH="400px">
              <VStack gap={4}>
                <Text fontSize="xl" fontWeight="medium" color="gray.500">
                  No students found
                </Text>
                <Text color="gray.400">Try adjusting your filters or search terms</Text>
              </VStack>
            </Flex>
          ) : (
            <>
              <Box overflowX="auto">
                <Table.Root variant="line" size="md">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Name</Table.ColumnHeader>
                      <Table.ColumnHeader>Email</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Tags</Table.ColumnHeader>
                      <Table.ColumnHeader>Last Active</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {data.students.map((student) => (
                      <Table.Row
                        key={student.id}
                        onClick={() => handleRowClick(student.id)}
                        cursor="pointer"
                        _hover={{ bg: 'gray.50' }}
                        transition="background 0.2s"
                      >
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
                        <Table.Cell color="gray.600">
                          {formatDate(student.lastActive)}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>

              {/* Pagination */}
              <Flex justify="space-between" align="center" mt={4} pt={4} borderTopWidth="1px">
                <Button onClick={handlePrev} disabled={prevCursors.length === 0} variant="outline">
                  Previous
                </Button>

                <Text color="gray.500" fontSize="sm">
                  Showing {data.students.length} students
                </Text>

                <Button
                  onClick={handleNext}
                  disabled={!data.pagination.hasNextPage}
                  variant="outline"
                >
                  Next
                </Button>
              </Flex>
            </>
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
}