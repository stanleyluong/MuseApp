import { AddIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex, Heading,
  IconButton,
  Input,
  Link,
  Spinner,
  Text,
  useColorMode, useColorModeValue,
  useToast,
  VStack
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Link as RouterLink, Routes } from 'react-router-dom';
import Playlist from '../../Components/Playlist/Playlist.js';
import SearchResults from '../../Components/SearchResults/SearchResults.js';
import Spotify from '../../util/Spotify.js';
import About from '../About';
import Favicon from '../Favicon';

function NavBar({ onLogout, onLogin, isAuthenticated }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const navBg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const navText = useColorModeValue('teal.600', 'teal.200');
  return (
    <Flex as="header" align="center" p={4} boxShadow="md" bg={navBg} position="sticky" top="0" zIndex="10">
      <Flex align="center">
        <Text fontSize="2xl" color="teal.500" mr={2}>♪</Text>
        <Heading as="h1" size="lg" color="teal.500" letterSpacing="wide">
          MuseApp
        </Heading>
      </Flex>
      <Flex ml="auto" align="center">
        <Link as={RouterLink} to="/" fontWeight="bold" mx={2} color={navText}>Home</Link>
        <Link as={RouterLink} to="/about" fontWeight="bold" mx={2} color={navText}>About</Link>
        {isAuthenticated ? (
          <Button onClick={onLogout} size="sm" colorScheme="gray" mx={2}>
            Logout
          </Button>
        ) : (
          <Button onClick={onLogin} size="sm" colorScheme="teal" mx={2}>
            Sign In
          </Button>
        )}
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          ml={2}
          variant="ghost"
        />
      </Flex>
    </Flex>
  );
}

function MainApp(props) {
  const cardBg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.200');
  const sidebarBg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const borderCol = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputColor = useColorModeValue('gray.800', 'white');
  const inputFocusBg = useColorModeValue('gray.100', 'gray.600');
  const infoBg = useColorModeValue('teal.50', 'gray.700');
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Open editor for a playlist
  const handleEditPlaylist = async (playlist) => {
    setIsNew(false);
    setEditingPlaylist(playlist);
    setEditorOpen(true);
    // Load tracks for the selected playlist
    if (props.onClear) props.onClear();
    if (playlist && playlist.id) {
      const tracks = await Spotify.getPlaylistTracks(playlist.id);
      const mappedTracks = tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        uri: track.uri,
        popularity: track.popularity,
        preview_url: track.preview_url
      }));
      if (props.setPlaylistTracksDirectly) props.setPlaylistTracksDirectly(mappedTracks);
      if (props.onNameChange) props.onNameChange(playlist.name);
    }
  };
  // Open editor for new playlist
  const handleAddPlaylist = () => {
    setIsNew(true);
    setEditingPlaylist(null);
    setEditorOpen(true);
    if (props.onClear) props.onClear();
    if (props.onNameChange) props.onNameChange('New Playlist');
  };
  // Close editor
  const handleCloseEditor = () => {
    setEditorOpen(false);
    setEditingPlaylist(null);
    setIsNew(false);
    if (props.onClear) props.onClear();
    if (props.onNameChange) props.onNameChange('New Playlist');
  };

  // Add track to the currently open playlist
  const handleAddTrack = (track) => {
    if (!editorOpen) {
      alert('Please select or create a playlist first!');
      return;
    }
    props.onAdd(track);
  };

  return (
    <Flex minH="100vh" bgGradient="linear(to-br, teal.900, purple.800)">
      {/* Sidebar */}
      <Box w={{ base: 'full', md: 72 }} bg={sidebarBg} p={4} boxShadow="2xl" minH="100vh">
        <Flex direction="column" h="full">
          <Heading as="h2" size="md" color="teal.500" mb={4}>My Playlists</Heading>
          {!props.isAuthenticated ? (
            <Button colorScheme="teal" mb={4} w="full" leftIcon={<AddIcon />} onClick={props.onLogin} fontSize="sm" py={5}>
              Sign in to manage playlists
            </Button>
          ) : (
            <Button colorScheme="teal" mb={4} onClick={handleAddPlaylist} w="full" leftIcon={<AddIcon />}>
              Add Playlist
            </Button>
          )}
          <VStack align="stretch" spacing={2} flex={1} overflowY="auto">
            {props.loadingPlaylists ? (
              <Spinner size="lg" />
            ) : props.userPlaylists.length > 0 ? (
              props.userPlaylists.map(pl => (
                <Button key={pl.id} variant="ghost" justifyContent="flex-start" onClick={() => handleEditPlaylist(pl)} p={2} leftIcon={pl.images && pl.images[0] ? <img src={pl.images[0].url} alt="cover" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} /> : undefined}>
                  <Box textAlign="left">
                    <Text fontWeight="bold">{pl.name}</Text>
                    <Text fontSize="sm" color="gray.500">{pl.tracks.total} tracks</Text>
                  </Box>
                </Button>
              ))
            ) : (
              <Text color="gray.700">No playlists found.</Text>
            )}
          </VStack>
        </Flex>
      </Box>
      {/* Center: Search and Results */}
      <Box flex={2} p={8} minW={0}>
        <VStack spacing={4} w="100%" maxW="2xl" mx="auto" bg={cardBg} p={8} borderRadius="xl" boxShadow="2xl" mb={8}>
          {!props.isAuthenticated && (
            <Box mb={4} p={4} bg={infoBg} borderRadius="md" boxShadow="sm" w="full">
              <Text fontSize="xl" fontWeight="bold" color="teal.600" mb={2} textAlign="center" fontFamily="'Poppins', 'Work Sans', sans-serif">
                Welcome to MuseApp!
              </Text>
              <Text color="gray.800" textAlign="center" fontFamily="'Poppins', 'Work Sans', sans-serif">
                MuseApp lets you search for songs, create and manage Spotify playlists, and save them directly to your Spotify account.<br/>
                Sign in with Spotify to get started!
              </Text>
            </Box>
          )}
          {!props.isAuthenticated ? (
            <>
              <Button colorScheme="teal" size="lg" w="full" onClick={props.onLogin}>
                Sign in with Spotify to search
              </Button>
              <Text color="gray.700" mt={2} textAlign="center">
                You must sign in to search for songs, albums, or artists.
              </Text>
            </>
          ) : (
            <>
              <Input
                placeholder="Enter a Song, Album, or Artist"
                size="lg"
                variant="filled"
                bg={inputBg}
                color={inputColor}
                _focus={{ bg: inputFocusBg }}
                onChange={e => props.onSearch(e.target.value, e)}
              />
              <Button colorScheme="teal" size="lg" w="full" onClick={e => props.onSearch(props.term, e)}>
                Search
              </Button>
            </>
          )}
        </VStack>
        <Box maxW="2xl" mx="auto" pb={12}>
          <SearchResults onAdd={handleAddTrack} searchResults={props.searchResults} tableId="search-results-table"/>
          {props.isLoadingMore && <Spinner size="md" color="teal.500" mt={4} />}
          {props.searchResults.length > 0 && props.hasMoreResults && !props.isLoadingMore ? (
            <Text color="gray.400" textAlign="center" mt={2} mb={2} fontStyle="italic">Scroll for more results...</Text>
          ) : null}
          {!props.hasMoreResults && !props.isLoadingMore && (
            <Text color="gray.400" textAlign="center" mt={4} mb={8} fontStyle="italic">End of results</Text>
          )}
        </Box>
      </Box>
      {/* Right: Playlist Editor */}
      {editorOpen && (
        <Box w={{ base: 'full', md: 96 }} maxW="420px" bg={cardBg} p={6} boxShadow="2xl" minH="100vh" borderLeftWidth={1} borderColor={borderCol} position="relative">
          <Playlist
            onSave={props.onSave}
            onNameChange={props.onNameChange}
            onRemove={props.onRemove}
            onAdd={props.onAdd}
            onClear={props.onClear}
            playlistName={props.playlistName}
            playlistTracks={props.playlistTracks}
            userPlaylists={props.userPlaylists}
            loadingPlaylists={props.loadingPlaylists}
            refreshPlaylists={props.refreshPlaylists}
            isAuthenticated={props.isAuthenticated}
            editingPlaylist={editingPlaylist}
            isNew={isNew}
            onCancel={handleCloseEditor}
          />
        </Box>
      )}
    </Flex>
  );
}

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [term, setTerm] = useState('');
  const [searchOffset, setSearchOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const toast = useToast();

  const setPlaylistTracksDirectly = (tracks) => setPlaylistTracks(tracks);

  const refreshPlaylists = useCallback((updatedList) => {
    if (updatedList) {
      setUserPlaylists(updatedList);
      setLoadingPlaylists(false);
      return;
    }
    setLoadingPlaylists(true);
    Spotify.getUserPlaylists().then(playlists => {
      setUserPlaylists(playlists);
      setLoadingPlaylists(false);
    });
  }, []);

  // Authentication and playlist fetching
  useEffect(() => {
    const hash = window.location.hash;
    let token = null;
    if (hash) {
      const match = hash.match(/access_token=([^&]*)/);
      if (match) {
        token = match[1];
        localStorage.setItem('spotify_access_token', token);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      token = localStorage.getItem('spotify_access_token');
    }
    if (token) {
      setIsAuthenticated(true);
      refreshPlaylists();
    }
  }, [refreshPlaylists]);

  const addTrack = (track) => {
    setPlaylistTracks(prev => prev.find(t => t.id === track.id) ? prev : [...prev, track]);
  };
  const removeTrack = (track) => {
    if (track && track.all) {
      setPlaylistTracks([]);
    } else {
      setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
    }
  };
  const updatePlaylistName = (name) => setPlaylistName(name);
  const clearPlaylist = () => setPlaylistTracks([]);
  const savePlaylist = async (imagePreview) => {
    if (!isAuthenticated) {
      toast({
        title: 'Please log in to save playlists to Spotify.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    const uris = playlistTracks.map(track => track.uri);
    const newPlaylist = await Spotify.savePlaylist(playlistName, uris);
    toast({
      title: `Your playlist ${playlistName} has been saved to Spotify!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
    // Optimistically add the new playlist to userPlaylists
    if (newPlaylist) {
      setUserPlaylists(prev => [
        {
          ...newPlaylist,
          name: playlistName,
          tracks: { total: playlistTracks.length },
          images: imagePreview ? [{ url: imagePreview }] : (newPlaylist.images || []),
        },
        ...prev
      ]);
    }
    setPlaylistName('New Playlist');
    setPlaylistTracks([]);
  };
  const search = async (term, e) => {
    if (e) e.preventDefault();
    setTerm(term);
    setSearchOffset(0);
    setHasMoreResults(true);
    setIsLoadingMore(false);
    const results = await Spotify.search(term, 0);
    setSearchResults(results);
    setSearchOffset(results.length);
    setHasMoreResults(results.length === 20);
  };
  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    window.location.reload();
  };

  // Infinite scroll handler for window
  const handleWindowScroll = useCallback(async () => {
    if (!hasMoreResults || isLoadingMore) return;
    const table = document.getElementById('search-results-table');
    if (!table) return;
    const rect = table.getBoundingClientRect();
    if (rect.bottom - 100 <= window.innerHeight) {
      setIsLoadingMore(true);
      const moreResults = await Spotify.search(term, searchOffset);
      setSearchOffset(prev => prev + moreResults.length);
      setIsLoadingMore(false);
      setSearchResults(prev => {
        const prevIds = new Set(prev.map(t => t.id));
        const uniqueNew = moreResults.filter(t => !prevIds.has(t.id));
        if (uniqueNew.length === 0) {
          setHasMoreResults(false);
          return prev;
        }
        if (uniqueNew.length < 20) setHasMoreResults(false);
        return [...prev, ...uniqueNew];
      });
    }
  }, [term, searchOffset, isLoadingMore, hasMoreResults]);

  // Attach scroll listeners
  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [handleWindowScroll]);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Favicon />
      <NavBar onLogout={handleLogout} onLogin={() => Spotify.getAccessToken(true)} isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={
          <MainApp
            searchResults={searchResults}
            playlistTracks={playlistTracks}
            playlistName={playlistName}
            onSearch={search}
            onAdd={addTrack}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onClear={clearPlaylist}
            onSave={savePlaylist}
            userPlaylists={userPlaylists}
            loadingPlaylists={loadingPlaylists}
            refreshPlaylists={refreshPlaylists}
            isAuthenticated={isAuthenticated}
            term={term}
            setPlaylistTracksDirectly={setPlaylistTracksDirectly}
            isLoadingMore={isLoadingMore}
            hasMoreResults={hasMoreResults}
            onLogin={() => Spotify.getAccessToken(true)}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
