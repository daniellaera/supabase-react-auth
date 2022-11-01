import { Box, ChakraProvider, theme, useToast } from '@chakra-ui/react';
import { AuthChangeEvent } from '@supabase/supabase-js';
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
import ProfileLayout from './pages/ProfileLayout';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';

export const App = () => {
  const session = supabaseClient.auth.getSession();
  const [signedIn, setSignedIn] = useState<boolean>(true);
  const toast = useToast();
  const [event, setEvent] = useState<AuthChangeEvent>()

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      setSignedIn(false);
      setEvent(event)
    }
    if (event === 'SIGNED_IN') {
      setSignedIn(true);
      setEvent(event)
    }
  });

  const showToast = (e: any) => {
    toast({
      position: 'bottom-left',
      render: () => (
        <Box color='white' p={3} bg='blue.500'>
         { e === 'SIGNED_IN' ? `Signed In` : `SIgned Out`}
        </Box>
      ),
    })
  }

  useEffect(() => {
    if (event) showToast(event)
  }, [event])

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
            <Route path="/profile" element={
                <ProtectedRoute session={session} signedIn={signedIn}>
                  <ProfileLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ProfilePage />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </ChakraProvider>
  );
};
