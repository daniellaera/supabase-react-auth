import {
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Input,
  keyframes,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import PersonalAvatar from '../components/PersonalAvatar';
import { pickListOptions } from '../config/pickListOptions';
import { supabaseClient } from '../config/supabase-client';
import eventBus from '../eventBus';
import { Select, CreatableSelect, AsyncSelect, OptionBase, GroupBase } from 'chakra-react-select';
import ProfileDetail from '../components/ProfileDetail';



const ProfilePage = () => {
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const toast = useToast();
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
      //console.log('i kno session', session)
    };

    setData();
  }, []);

  useEffect(() => {
    if (session) {
      const setUserData = async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        setUser(user)
      }
      setUserData()
    }
  }, [session])

  useEffect(() => {
    if (user) {
      setProfile()
    }
  }, [user])

  const setProfile = async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabaseClient
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status === 406) {
        toast({
          title: 'No profile yet',
          position: 'top',
          description: 'Create your profile',
          status: 'info',
          duration: 5000,
          isClosable: true
        });
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


      <PersonalAvatar
        url={avatar_url}
        onUpload={(url: any) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />
      <Box textAlign={'center'}>
        <Text fontSize={'sm'} fontWeight={500} color={'gray.500'} mb={4}>
          {session?.user?.email}
        </Text></Box>
      <ProfileDetail />
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


    </div>
  );
};

export default ProfilePage;
