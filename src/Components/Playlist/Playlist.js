import { CloseIcon } from '@chakra-ui/icons';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Card, CardBody, Heading, HStack, IconButton, Input, Spinner, Text, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import TrackList from '../../Components/TrackList/TrackList.js';
import Spotify from '../../util/Spotify.js';
import './Playlist.css';

function Playlist(props) {
    const cardBg = useColorModeValue('whiteAlpha.900', 'gray.700');
    const [playlistName, setPlaylistName] = useState(props.playlistName);
    const [originalPlaylist, setOriginalPlaylist] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const cancelRef = useRef();
    const toast = useToast();
    const [newCoverFile, setNewCoverFile] = useState(null);
    const [newCoverPreview, setNewCoverPreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const isAuthenticated = props.isAuthenticated;
    const editingPlaylist = props.editingPlaylist;
    const isNew = props.isNew;

    // When editingPlaylist changes, set up originalPlaylist for unsaved changes detection
    useEffect(() => {
        if (editingPlaylist) {
            setOriginalPlaylist({
                id: editingPlaylist.id,
                name: editingPlaylist.name,
                tracks: (props.playlistTracks || []).map(t => t.uri)
            });
        } else if (isNew) {
            setOriginalPlaylist({ name: 'New Playlist', tracks: [] });
        } else {
            setOriginalPlaylist(null);
        }
        setNewCoverFile(null);
        setNewCoverPreview(null);
    }, [editingPlaylist, isNew, props.playlistTracks]);

    const handleNameChange = (e) => {
        setPlaylistName(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const uris = props.playlistTracks.map(track => track.uri);
            if (editingPlaylist) {
                await Spotify.updatePlaylist(editingPlaylist.id, playlistName, uris);
                let coverJustUpdated = false;
                // Upload new cover image if selected
                if (newCoverFile && newCoverPreview) {
                    try {
                        const base64 = newCoverPreview.split(',')[1];
                        await Spotify.uploadPlaylistCover(editingPlaylist.id, base64);
                        coverJustUpdated = true;
                        toast({
                            title: 'Cover image updated!',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                            position: 'top',
                        });
                    } catch (err) {
                        toast({
                            title: 'Failed to update cover image',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                            position: 'top',
                        });
                    }
                }
                // Optimistically update local playlist list (including cover image if just updated)
                if (props.userPlaylists && props.refreshPlaylists) {
                    const updated = props.userPlaylists.map(pl => {
                        if (pl.id === editingPlaylist.id) {
                            const updatedPl = { ...pl, name: playlistName, tracks: { ...pl.tracks, total: props.playlistTracks.length } };
                            if (coverJustUpdated && newCoverPreview) {
                                updatedPl.images = [{ url: newCoverPreview }];
                            }
                            return updatedPl;
                        }
                        return pl;
                    });
                    props.refreshPlaylists(updated); // Pass updated list
                } else if (props.refreshPlaylists) {
                    props.refreshPlaylists();
                }
                toast({
                    title: 'Playlist updated!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                });
                if (props.onCancel) props.onCancel();
            } else {
                props.onSave(newCoverPreview);
                if (props.refreshPlaylists) props.refreshPlaylists();
                toast({
                    title: `Your playlist ${playlistName} has been saved to Spotify!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                });
                if (props.onCancel) props.onCancel();
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasUnsavedChanges()) {
            setShowConfirm(true);
        } else {
            if (props.onCancel) props.onCancel();
        }
    };

    const confirmDiscard = () => {
        setShowConfirm(false);
        if (props.onCancel) props.onCancel();
    };

    function hasUnsavedChanges() {
        if (!originalPlaylist) return false;
        if (playlistName !== originalPlaylist.name) return true;
        const currentUris = props.playlistTracks.map(t => t.uri);
        return JSON.stringify(currentUris) !== JSON.stringify(originalPlaylist.tracks);
    }

    // Only show the editor UI, never the playlist list
    return (
        <Card bg={cardBg} borderRadius="xl" boxShadow="xl" p={4} position="relative">
            <IconButton
                icon={<CloseIcon />}
                aria-label="Close editor"
                size="sm"
                colorScheme="gray"
                variant="ghost"
                position="absolute"
                top={2}
                right={2}
                zIndex={10}
                onClick={props.onCancel}
            />
            <CardBody>
                {isSaving && (
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="whiteAlpha.700" zIndex={10} display="flex" alignItems="center" justifyContent="center" borderRadius="xl">
                        <Spinner size="xl" color="purple.500" thickness="4px" />
                    </Box>
                )}
                <Heading as="h3" size="sm" mb={2} color="teal.500">{editingPlaylist ? 'Edit Playlist' : 'New Playlist'}</Heading>
                {/* Show preview of new cover image if selected, else current cover */}
                {newCoverPreview ? (
                    <img src={newCoverPreview} alt="new cover preview" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', marginBottom: 12 }} />
                ) : editingPlaylist && props.userPlaylists && props.userPlaylists.length > 0 && (
                    (() => {
                        const pl = props.userPlaylists.find(p => p.id === editingPlaylist.id);
                        return pl && pl.images && pl.images[0] ? (
                            <img src={pl.images[0].url} alt="cover" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', marginBottom: 12 }} />
                        ) : null;
                    })()
                )}
                <Box mb={2}>
                    <input type="file" accept="image/jpeg,image/png" style={{ display: 'block', marginBottom: 8 }} onChange={handleImageChange} disabled={isSaving} />
                    <Text fontSize="xs" color="gray.400">Upload a new cover image (JPEG, &lt;256KB)</Text>
                </Box>
                <Input id="playlistnameinput" onChange={handleNameChange} placeholder="Enter Playlist Name" value={playlistName} mb={2} disabled={isSaving}/>
                <TrackList onRemove={props.onRemove} isRemoval={true} tracks={props.playlistTracks}/>
                <HStack mt={4}>
                    <Button colorScheme="gray" variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                    <Tooltip label={isAuthenticated ? '' : 'Log in to save playlists to Spotify'} isDisabled={isAuthenticated} hasArrow>
                        <Button colorScheme="purple" w="full" onClick={handleSave} isLoading={isSaving} disabled={isSaving || !isAuthenticated}>
                            {editingPlaylist ? 'SAVE CHANGES' : 'SAVE TO SPOTIFY'}
                        </Button>
                    </Tooltip>
                </HStack>
                <AlertDialog
                    isOpen={showConfirm}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setShowConfirm(false)}
                >
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Discard changes?
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            You have unsaved changes. Are you sure you want to discard them?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setShowConfirm(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmDiscard} ml={3}>
                                Discard
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardBody>
        </Card>
    );
}

export default Playlist;