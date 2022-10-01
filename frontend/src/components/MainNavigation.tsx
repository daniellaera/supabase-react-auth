import { Box, Button, Flex, HStack, useColorModeValue } from '@chakra-ui/react';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { supabaseClient } from '../config/supabase-client';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    setSession(supabaseClient.auth.session());

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        
        <HStack spacing={8} alignItems={'center'}>
        <Box>Logo</Box>
        <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
          
            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Invoices
            </NavLink>
          
            <NavLink
              to="/posts"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Posts
            </NavLink>
          
          
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Profile
              
            </NavLink>
         
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
        {session ? (
            <Button
            onClick={() => supabaseClient.auth.signOut()}
            variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              mr={4}
              leftIcon={<FiLogOut />}>
          
            Logout
          </Button>
          ): (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Login
              
            </NavLink>
          )}
          <ColorModeSwitcher justifySelf="flex-end" marginLeft={4}/>
        </Flex>
        
      </Flex>
      </Box>
    )
}

export default MainNavigation