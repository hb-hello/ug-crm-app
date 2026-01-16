import { Card, Input, Stack } from '@chakra-ui/react';
import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react';
import { TagMultiSelect } from '@/components/common/TagMultiSelect';

interface StudentFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    country: string;
    onCountryChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    tags: string[];
    onTagsChange: (value: string[]) => void;
    filterOptions: {
        countries: string[];
        statuses: string[];
        tags: string[];
    };
}

export function StudentFilters({
    search,
    onSearchChange,
    country,
    onCountryChange,
    status,
    onStatusChange,
    tags,
    onTagsChange,
    filterOptions,
}: StudentFiltersProps) {
    return (
        <Card.Root mb={6}>
            <Card.Body>
                <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        size="lg"
                    />

                    <NativeSelectRoot size="lg">
                        <NativeSelectField
                            placeholder="Filter by country"
                            value={country}
                            onChange={(e) => onCountryChange(e.target.value)}
                        >
                            <option value="">All Countries</option>
                            {filterOptions.countries.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </NativeSelectField>
                    </NativeSelectRoot>

                    <NativeSelectRoot size="lg">
                        <NativeSelectField
                            placeholder="Filter by status"
                            value={status}
                            onChange={(e) => onStatusChange(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {filterOptions.statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </NativeSelectField>
                    </NativeSelectRoot>

                    <TagMultiSelect value={tags} onChange={onTagsChange} options={filterOptions.tags} />
                </Stack>
            </Card.Body>
        </Card.Root>
    );
}
