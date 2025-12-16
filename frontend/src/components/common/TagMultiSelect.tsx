// /components/filters/TagMultiSelect.tsx

'use client'; // needed if you're using Next.js App Router

import {
    Portal,
    Select,
    Box,
    Text,
    createListCollection,
} from '@chakra-ui/react';

const tagOptions = [
    { label: 'High Intent', value: 'High Intent' },
    { label: 'Unresponsive', value: 'Unresponsive' },
    { label: 'Cold Lead', value: 'Cold Lead' },
];

const tagCollection = createListCollection({
    items: tagOptions,
});

interface TagMultiSelectProps {
    value: string[];
    onChange: (val: string[]) => void;
}

export const TagMultiSelect: React.FC<TagMultiSelectProps> = ({
    value,
    onChange,
}) => {
    return (
        <Box width="320px">
            <Select.Root
                multiple
                collection={tagCollection}
                value={value}
                onValueChange={(details) => {
                    onChange(details.value);
                }}
                size="sm"
            >
                <Select.HiddenSelect />
                <Select.Label>
                    <Text fontWeight="medium">Tags</Text>
                </Select.Label>

                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select tags" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                        <Select.ClearTrigger />
                    </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {tagCollection.items.map((tag) => (
                                <Select.Item key={tag.value} item={tag}>
                                    {tag.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </Box>
    );
};
