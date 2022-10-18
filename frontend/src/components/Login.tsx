import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { FiGithub } from 'react-icons/fi';
import { useLocation, useParams } from 'react-router-dom';
import { supabaseClient } from '../config/supabase-client';
import eventBus from '../eventBus';

const Login = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  
  const signInWithGithub = async () => {
    try {
      setLoadingGithub(true)
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
      });
      if (error) throw error
      /*toast({
        title: 'Signed in with GitHub',
        position: 'top',
        description: 'You have successfully authenticated with GitHub',
        status: 'success',
        duration: 5000,
        isClosable: true
      });*/
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
    }
  };

  const handleLogin = async (email: any) => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signInWithOtp({ email });

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
    <Flex minH={'80vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            and start connecting with other developers ✌️
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
            </FormControl>
            <Stack spacing={4}>
              <Button
                onClick={e => {
                  e.preventDefault();
                  handleLogin(email);
                }}
                isLoading={loading}
                loadingText="Signing in ..."
                colorScheme="teal"
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
                isLoading={loadingGithub}
                loadingText="Signing in ..."
                colorScheme="gray"
                spinnerPlacement="start"
                leftIcon={<FiGithub size="30" />}>
                {loadingGithub || 'GitHub'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
    /* <>
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
    </> */
  );
};

export default Login;
