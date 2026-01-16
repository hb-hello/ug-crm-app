import { Box, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from 'crm-shared';
import { api } from '@/services/api';
import { useUserStore } from '@/store/userStore';
import { HeaderStats, StudentFilters, StudentTable } from '@/components/students';

interface StudentStatsResponse {
    summary: {
        total: number;
        Prospect: number;
        Applying: number;
        Submitted: number;
        Admitted: number;
        Rejected: number;
        Enrolled: number;
    };
}

interface StudentSearchResponse {
    students: Student[];
    pagination: {
        hasNextPage: boolean;
        nextCursor?: string;
    };
    filterOptions: {
        tags: string[];
        statuses: string[];
        countries: string[];
    };
}

export default function Students() {
    // Filter state
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [country, setCountry] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    // Pagination state
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [prevCursors, setPrevCursors] = useState<string[]>([]);

    const navigate = useNavigate();
    const currentUser = useUserStore((state) => state.currentUser);

    // Stats query - runs once on mount
    const { data: statsData } = useQuery<StudentStatsResponse>({
        queryKey: ['students-stats'],
        queryFn: async () => {
            const response = await api.get('/students/stats');
            return response.data;
        },
        enabled: !!currentUser,
    });

    // Search query - runs when filters change
    const { data: searchData, isLoading: searchLoading, isError, isFetching } = useQuery<StudentSearchResponse>({
        queryKey: ['students-search', { search, status, country, tags, cursor }],
        queryFn: async () => {
            const response = await api.get('/students/search', {
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
        placeholderData: (previousData) => previousData,
        enabled: !!currentUser,
    });

    const handleNext = () => {
        if (searchData?.pagination.nextCursor) {
            if (cursor) {
                setPrevCursors((prev) => [...prev, cursor]);
            }
            setCursor(searchData.pagination.nextCursor);
        }
    };

    const handlePrev = () => {
        const newPrevCursors = [...prevCursors];
        const prevCursor = newPrevCursors.pop();
        setPrevCursors(newPrevCursors);
        setCursor(prevCursor);
    };

    const handleRowClick = (studentId: string) => {
        navigate(`/students/${studentId}`);
    };

    return (
        <Box p={8}>
            <Heading size="2xl" mb={6}>
                Students
            </Heading>

            <HeaderStats
                summary={statsData?.summary}
            />

            <StudentFilters
                search={search}
                onSearchChange={setSearch}
                country={country}
                onCountryChange={setCountry}
                status={status}
                onStatusChange={setStatus}
                tags={tags}
                onTagsChange={setTags}
                filterOptions={searchData?.filterOptions ?? { countries: [], statuses: [], tags: [] }}
            />

            <StudentTable
                students={searchData?.students ?? []}
                isLoading={searchLoading || isFetching}
                isError={isError}
                onRowClick={handleRowClick}
                onNext={handleNext}
                onPrev={handlePrev}
                hasNextPage={searchData?.pagination?.hasNextPage ?? false}
                hasPrevPage={prevCursors.length > 0}
            />
        </Box>
    );
}
