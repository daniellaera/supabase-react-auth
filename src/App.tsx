import { ChakraProvider } from '@chakra-ui/react';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Account from '../src/components/Account';
import Auth from '../src/components/Auth';
import './App.css';
import { supabaseClient } from './config/supabase-client';
import theme from './config/theme';

function App() {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    setSession(supabaseClient.auth.session());

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <ChakraProvider theme={theme}>{!session ? <Auth /> : <Account key={session.user?.id} session={session} />}</ChakraProvider>;
}

export default App;
