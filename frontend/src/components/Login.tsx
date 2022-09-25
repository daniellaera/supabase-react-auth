import { Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FiGithub } from 'react-icons/fi';
import { supabaseClient } from "../config/supabase-client";

const Login = () => {
    const [email, setEmail] = useState('');
  const toast = useToast();
  const [loading, setLoading] = useState(false);

    const signInWithGithub = async () => {
        await supabaseClient.auth.signIn({
          provider: 'github'
        });
      };
    
      const handleLogin = async (email: any) => {
        try {
          setLoading(true);
          const { error } = await supabaseClient.auth.signIn({ email });
          if (error) throw error;
          toast({
            title: 'Account created.',
            position: 'top',
            description: 'Check your email for the login link',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        } catch (error: any) {
          toast({
            title: 'Error',
            position: 'top',
            description: error.error_description || error.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        } finally {
          setLoading(false);
        }
      };

    return (
        <>
            <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
              </FormControl>
                <Button
                  onClick={e => {
                    e.preventDefault();
                    handleLogin(email);
                  }}
                  isLoading={loading}
                  loadingText="Signing in ..."
                  colorScheme="teal"
                  variant="outline"
                  spinnerPlacement="start"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500'
                  }}>
                  {loading || 'Send magic link'}
                </Button>
                <Button
                  onClick={e => {
                    e.preventDefault();
                    signInWithGithub();
                  }}
                  isLoading={loading}
                  loadingText="Signing in ..."
                  colorScheme="teal"
                  variant="outline"
                  spinnerPlacement="start"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500'
                  }}
                  leftIcon={<FiGithub size="30" />}>
                  GitHub
                </Button>
              </>
    )
}

export default Login