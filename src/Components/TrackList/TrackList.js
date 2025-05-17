import { Text, VStack } from '@chakra-ui/react';
import React from 'react';
import Track from '../Track/Track.js';

function TrackList({ tracks, onRemove, isRemoval, onAdd }) {
    return (
        <VStack spacing={2} align="stretch">
            {tracks && tracks.length > 0 ? (
                tracks.map(track => (
                    <Track 
                        key={track.id}
                        track={track}
                        onRemove={onRemove}
                        isRemoval={isRemoval}
                        onAdd={onAdd}
                    />
                ))
            ) : (
                <Text color="gray.400" fontStyle="italic">No tracks to display.</Text>
            )}
        </VStack>
    );
}

export default TrackList;