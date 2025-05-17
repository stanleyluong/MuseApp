import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Badge, Box, Flex, Heading, IconButton, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

function Track({ track, isRemoval, onAdd, onRemove }) {
    const cardBg = useColorModeValue('whiteAlpha.900', 'gray.700');
    const isHot = track.popularity && track.popularity > 80;

    const addTrack = () => onAdd(track);
    const removeTrack = () => onRemove(track);

    return (
        <Box bg={cardBg} borderRadius="md" boxShadow="md" p={3} mb={2} display="flex" alignItems="center" justifyContent="space-between">
            <Box>
                <Heading as="h3" size="sm" color="teal.600" mb={1}>{track.name}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {track.artist}
                  {track.artist && track.album ? ' | ' : ''}
                  {track.album}
                </Text>
                {isHot && <Badge colorScheme="red" ml={2}>🔥 Hot</Badge>}
            </Box>
            <Flex align="center" gap={2}>
                {isRemoval ? (
                    <Tooltip label="Remove from Playlist" hasArrow>
                        <IconButton
                            icon={<MinusIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={removeTrack}
                            aria-label="Remove track"
                            _hover={{ bg: 'red.100', transform: 'scale(1.1)' }}
                        />
                    </Tooltip>
                ) : (
                    <Tooltip label="Add to Playlist" hasArrow>
                        <IconButton
                            icon={<AddIcon />}
                            colorScheme="teal"
                            variant="ghost"
                            size="sm"
                            onClick={addTrack}
                            aria-label="Add track"
                            _hover={{ bg: 'teal.100', transform: 'scale(1.1)' }}
                        />
                    </Tooltip>
                )}
            </Flex>
        </Box>
    );
}

export default Track;