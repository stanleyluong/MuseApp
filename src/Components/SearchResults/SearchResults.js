import { Box, Button, Heading, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import './SearchResults.css';

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'artist', label: 'Artist' },
    { key: 'popularity', label: 'Popularity' },
    { key: 'album', label: 'Album' },
    { key: 'duration_ms', label: 'Duration' },
];

function getCellValue(track, key) {
    if (key === 'duration_ms') return track.duration_ms || 0;
    if (key === 'artist') return track.artist || (track.artists && track.artists[0] && track.artists[0].name) || '';
    return track[key] || '';
}

function SearchResults({ searchResults, onAdd }) {
    const [sortBy, setSortBy] = useState('popularity');
    const [sortDir, setSortDir] = useState('desc');

    const sortedResults = useMemo(() => {
        if (!searchResults) return [];
        const sorted = [...searchResults].sort((a, b) => {
            let aVal = getCellValue(a, sortBy);
            let bVal = getCellValue(b, sortBy);
            if (sortBy === 'popularity' || sortBy === 'duration_ms') {
                aVal = Number(aVal);
                bVal = Number(bVal);
            } else {
                aVal = (aVal || '').toString().toLowerCase();
                bVal = (bVal || '').toString().toLowerCase();
            }
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [searchResults, sortBy, sortDir]);

    const handleSort = (col) => {
        if (sortBy === col) {
            setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(col);
            setSortDir(col === 'popularity' || col === 'duration_ms' ? 'desc' : 'asc');
        }
    };

    const getSortIndicator = (col) => {
        if (sortBy !== col) return '';
        return sortDir === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <Box>
            <Heading size="md" mb={4} color="teal.500" fontWeight="bold" letterSpacing="wide">
                Results
            </Heading>
            {sortedResults && sortedResults.length > 0 ? (
                <Box overflowX="auto">
                    <Table variant="simple" size="sm" bg="whiteAlpha.700" borderRadius="md" boxShadow="sm" minWidth="600px">
                        <Thead>
                            <Tr>
                                {columns.map(col => (
                                    <Th
                                        key={col.key}
                                        onClick={() => handleSort(col.key)}
                                        cursor="pointer"
                                        userSelect="none"
                                        _hover={{ color: 'teal.500' }}
                                    >
                                        {col.label}{getSortIndicator(col.key)}
                                    </Th>
                                ))}
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {sortedResults.map(track => (
                                <Tr key={track.id}>
                                    <Td fontWeight="bold">{track.name}</Td>
                                    <Td>{track.artist || (track.artists && track.artists[0] && track.artists[0].name)}</Td>
                                    <Td>{track.popularity}</Td>
                                    <Td>{track.album}</Td>
                                    <Td>{track.duration_ms ? formatDuration(track.duration_ms) : ''}</Td>
                                    <Td>
                                        {onAdd && (
                                            <Button size="xs" colorScheme="teal" onClick={() => onAdd(track)}>
                                                Add
                                            </Button>
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            ) : (
                <Text color="gray.400" fontStyle="italic">
                    No results yet. Try searching for a song, album, or artist!
                </Text>
            )}
        </Box>
    );
}

export default SearchResults;