import { useEffect, useState } from 'react';
import './App.css';
import { supabaseClient } from './config/supabase-client';
import { Session } from '@supabase/supabase-js';
import { ChakraProvider } from '@chakra-ui/react';
import Auth from '../src/components/Auth';
import Account from '../src/components/Account';

function App() {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    setSession(supabaseClient.auth.session());

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <ChakraProvider>{!session ? <Auth /> : <Account key={session.user?.id} session={session} />}</ChakraProvider>;
}

export default App;
