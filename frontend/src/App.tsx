import { ChakraProvider, theme } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Invoices from './components/Invoices';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './components/RootLayout';
import { supabaseClient } from './config/supabase-client';
import NewPostPage from './pages/NewPostPage';
import PostDetailPage from './pages/PostDetailPage';
import PostLayout from './pages/PostLayout';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';

export const App = () => {
  const session = supabaseClient.auth.getSession();
  const [signedIn, setSignedIn] = useState<boolean>(true);

  supabaseClient.auth.onAuthStateChange((event, session) => {
    //console.log(event, session)
    if (event === 'SIGNED_OUT') {
      setSignedIn(false);
    }
    if (event === 'SIGNED_IN') {
      setSignedIn(true);
    }
  });

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <RootLayout>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/posts" element={<PostLayout />}>
              <Route index element={<PostPage />} />
            </Route>
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route
              path="/post/new"
              element={
                <ProtectedRoute session={session} signedIn={signedIn}>
                  <NewPostPage />
                </ProtectedRoute>
              }
            />
            <Route path="/invoices" element={<Invoices />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute session={session} signedIn={signedIn}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </ChakraProvider>
  );
  /* <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Logo h="40vmin" pointerEvents="none" />
          <Text>
            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
          </Text>
          <Link
            color="teal.500"
            href="https://chakra-ui.com"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Chakra
          </Link>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider> */
};
