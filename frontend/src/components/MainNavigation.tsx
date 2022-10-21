import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { supabaseClient } from '../config/supabase-client';
import eventBus from '../eventBus';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const [session, setSession] = useState<Session | null>();
  const [avatar_url, setAvatarUrl] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();

  useEffect(() => {
    // we listen here if someone cleans the storage in the browser
    // so we push him back and logout
    // check: https://stackoverflow.com/questions/56660153/how-to-listen-to-localstorage-value-changes-in-react
    const handleLocalStorage = () => {
      window.addEventListener('storage', (event) => {
        if (event) supabaseClient.auth.signOut()
      })
    }
    if (session) getAvatarUrl();
    handleLocalStorage()
  }, [session]);

  useEffect(() => {
    if (avatar_url) {
      downloadImageFromUrl(avatar_url);
    }
  }, [avatar_url]);

  // we listen for potential ProfilePage.tsx updates especially avatar
  // and we reload the gravatar url
  eventBus.on('profileUpdated', (hasUpdated: boolean) => {
    if (hasUpdated) {
      getAvatarUrl();
    }
  });

  async function downloadImageFromUrl(path: any) {
    try {
      const { data, error }: any = await supabaseClient.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url: any = URL.createObjectURL(data);
      setImageUrl(url);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function getAvatarUrl() {
    try {
      const {
        data: { user }
      } = await supabaseClient.auth.getUser();

      let { data, error, status } = await supabaseClient
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data.avatar_url);
        setUsername(data.username);
      }
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error
      } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
    };

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    setData();
  }, []);

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <Box>🚀</Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/invoices" className={({ isActive }) => (isActive ? classes.active : undefined)} end>
              Invoices
            </NavLink>

            <NavLink to="/posts" className={({ isActive }) => (isActive ? classes.active : undefined)} end>
              Posts
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) => (isActive ? classes.active : undefined)} end>
              Profile
            </NavLink>
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          {session ? (
            <>
              <Button
                onClick={() => supabaseClient.auth.signOut()}
                variant={'solid'}
                colorScheme={'teal'}
                size={'sm'}
                mr={4}
                leftIcon={<FiLogOut />}>
                Logout
              </Button>
              <Menu>
                <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                  <HStack>
                    <Avatar size={'sm'} src={avatar_url ? imageUrl : ''} />
                    <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                      <Text fontSize="sm">{username}</Text>
                      <Text fontSize="xs" color="gray.600">
                        Admin
                      </Text>
                    </VStack>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <NavLink to="/profile" className={({ isActive }) => (isActive ? classes.active : undefined)} end>
                    <MenuItem>Profile</MenuItem>
                  </NavLink>

                  <MenuItem>Settings</MenuItem>
                  <MenuItem>Billing</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => supabaseClient.auth.signOut()}>Sign out</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? classes.active : undefined)} end>
              Login
            </NavLink>
          )}
          <ColorModeSwitcher justifySelf="flex-end" marginLeft={4} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default MainNavigation;
