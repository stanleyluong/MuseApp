import { Box, Card, CardBody, Link as ChakraLink, Divider, Heading, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';

const About = () => {
  const cardBg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.200');
  return (
    <Box minH="100vh" bgGradient="linear(to-br, teal.900, purple.800)" py={12} px={4}>
      <Card maxW="700px" mx="auto" bg={cardBg} borderRadius="xl" boxShadow="2xl">
        <CardBody>
          <Heading as="h1" mb={4} color="teal.500">About MuseApp</Heading>
          <Text mb={4} color={useColorModeValue('gray.700', 'gray.200')}>
            <b>MuseApp</b> is a web application that lets you search for songs and save custom playlists to your Spotify account.
          </Text>
          <Heading as="h2" size="md" mt={6} mb={2} color={useColorModeValue('teal.600', 'teal.200')}>Stack & Technologies Used</Heading>
          <List spacing={2} mb={4}>
            <ListItem><b>Frontend:</b> React (Create React App)</ListItem>
            <ListItem><b>Routing:</b> React Router DOM v6</ListItem>
            <ListItem><b>Styling:</b> Chakra UI</ListItem>
            <ListItem><b>API:</b> Spotify Web API (OAuth Implicit Grant Flow)</ListItem>
            <ListItem><b>Deployment:</b> AWS Amplify</ListItem>
            <ListItem><b>Version Control:</b> Git & GitHub</ListItem>
            <ListItem><b>Other:</b> ESLint, Webpack, npm</ListItem>
          </List>
          <Divider my={4} />
          <Heading as="h2" size="md" mb={2} color={useColorModeValue('teal.600', 'teal.200')}>Author</Heading>
          <Text mb={4} color={useColorModeValue('gray.700', 'gray.200')}>Stanley Luong</Text>
          <Heading as="h2" size="md" mb={2} color={useColorModeValue('teal.600', 'teal.200')}>Source Code</Heading>
          <ChakraLink href="https://github.com/stanleyluong/MuseApp" isExternal color="teal.500">
            GitHub Repository
          </ChakraLink>
        </CardBody>
      </Card>
    </Box>
  );
};

export default About; 