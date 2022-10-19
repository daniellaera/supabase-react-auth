import {
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import PersonalAvatar from '../components/PersonalAvatar';
import { pickListOptions } from '../config/pickListOptions';
import { supabaseClient } from '../config/supabase-client';
import eventBus from '../eventBus';
import { Select, CreatableSelect, AsyncSelect, OptionBase, GroupBase } from 'chakra-react-select';

const mappedColourOptions = pickListOptions.map(option => ({
  ...option,
  colorScheme: option.color
}));

const ProfilePage = () => {
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      if (session) getProfile();
    }
    getSession();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabaseClient.auth.getUser();

      let { data, error, status } = await supabaseClient
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }: any) {
    try {
      setLoading(true);
      const {
        data: { user }
      } = await supabaseClient.auth.getUser();

      const updates = {
        id: user?.id,
        username,
        website,
        avatar_url,
        updated_at: new Date()
      };

      let { error } = await supabaseClient.from('profiles').upsert(updates, {
        returning: 'minimal' // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
      toast({
        title: 'Profile updated.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      eventBus.dispatch('profileUpdated', true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Box
          maxW={'445px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'lg'}
          p={6}
          textAlign={'center'}
          justifyItems={'center'}
          justifyContent={'center'}>
          <PersonalAvatar
            size={'2xl'}
            url={avatar_url}
            onUpload={(url: any) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url });
            }}
          />
          <Text fontSize={'sm'} fontWeight={500} color={'gray.500'} mb={4}>
            {session?.user?.email}
          </Text>
          <Stack spacing={4} p={4}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type={'text'}
                value={username || ''}
                onChange={(e: any) => setUsername(e.target.value)}
                placeholder={username || 'username'}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                rounded={'full'}
                border={0}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none'
                }}
              />
            </FormControl>
          </Stack>
          <Stack spacing={4} p={4}>
            <FormControl>
              <FormLabel>Website</FormLabel>
              <Input
                type={'text'}
                value={website || ''}
                onChange={(e: any) => setWebsite(e.target.value)}
                placeholder={website || 'website'}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                rounded={'full'}
                border={0}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none'
                }}
              />
            </FormControl>
          </Stack>
          {/* <FormControl p={4}>
            <FormLabel>
              Select programming languages that you like most
            </FormLabel>
            <Select
              isMulti
              name="colors"
              options={mappedColourOptions}
              placeholder="Pick some languages ..."
              closeMenuOnSelect={false}
            />
          </FormControl> */}
          <Stack spacing={4} p={4}>
          <FormControl>
            <FormLabel>Select programming languages that you like most</FormLabel>
            <AsyncSelect
              isMulti
              name="colors"
              options={mappedColourOptions}
              placeholder="ex: Java, GoLang"
              closeMenuOnSelect={false}
              size="md"
              loadOptions={(inputValue, callback) => {
                setTimeout(() => {
                  const values = mappedColourOptions.filter((i) =>
                    i.label.toLowerCase().includes(inputValue.toLowerCase())
                  );
                  callback(values);
                }, 3000);
              }}
            />
          </FormControl>
          </Stack>
          <Stack mt={8} direction={'row'} spacing={4}>
            <Button
              onClick={() => supabaseClient.auth.signOut()}
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              _focus={{
                bg: 'gray.200'
              }}>
              Logout
            </Button>
            <Button
              isLoading={loading}
              loadingText="Updating ..."
              onClick={() => updateProfile({ username, website, avatar_url })}
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'green.400'}
              color={'white'}
              boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
              _hover={{
                bg: 'green.500'
              }}
              _focus={{
                bg: 'green.500'
              }}>
              {loading || 'Update'}
            </Button>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default ProfilePage;
