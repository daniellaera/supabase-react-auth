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
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { getPictureByProfileId, getProfileByAuthorEmail } from '../api';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { supabaseClient } from '../config/supabase-client';
import eventBus from '../eventBus';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const [session, setSession] = useState<Session | null>();
  const [avatar_url, setAvatarUrl] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [profile, setProfile] = useState<IProfile>()

  useEffect(() => {
    // we listen here if someone cleans the storage in the browser
    // so we push him back and logout
    // check: https://stackoverflow.com/questions/56660153/how-to-listen-to-localstorage-value-changes-in-react
    const handleLocalStorage = () => {
      window.addEventListener('storage', (event) => {
        if (event) supabaseClient.auth.signOut()
      })
    }
    //if (session) getAvatarUrl();
    if (session) refetch()
    handleLocalStorage()
  }, [session]);

  const fetchProfilePicture = async () => {
    const res: AxiosResponse<ApiDataType> = await getPictureByProfileId(profile?.id!)
    return res.data
  }

  const { data: pictureData, isLoading, refetch: refetchPicture } = useQuery(['profilePicture'], fetchProfilePicture, {
    enabled: false, onSuccess(res: IPicture) {

    },
    onError: () => {
      console.log(error)
    }
  })

  useEffect(() => {
    if (profileData) {
      setProfile(profileData)
    }
    if (profile) {
      refetchPicture()
    }
    if (pictureData) {
      setAvatarUrl(pictureData.avatarUrl)
    }
  }, [avatar_url, profile, pictureData]);

  useEffect(() => {
    if (avatar_url) downloadImage(avatar_url);
  }, [avatar_url]);

  async function downloadImage(path: any) {
    try {
      const { data, error }: any = await supabaseClient.storage.from('images').download(path);
      if (error) {
        throw error;
      }
      const url: any = URL.createObjectURL(data);
      setImageUrl(url);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }
  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(session?.user.email!)
    return res.data;
  };

  const { data: profileData, error, isLoading: isFetchingProfile, refetch } = useQuery(['profile'], fetchProfile, {
    enabled: false, onSuccess(res: IProfile) {
      if (res != null) {
        setUsername(res.username)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  });

  // we listen for potential ProfilePage.tsx updates especially avatar
  // and we reload the gravatar url
  eventBus.on('profileUpdated', (hasUpdated: boolean) => {
    if (hasUpdated) {
      refetch()
      refetchPicture()
    }
  });

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
            <NavLink to="/" className={({ isActive }) => (isActive ? classes.active : undefined)} end>
              <Button leftIcon={<FaHome />} colorScheme='teal' variant='ghost' size={'sm'} mr={4}>
                Home
              </Button>
            </NavLink>
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
