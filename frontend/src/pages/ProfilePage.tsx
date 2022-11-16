import {
  Badge,
  Box,
  Text,
  useToast
} from '@chakra-ui/react';
import { Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import PersonalAvatar from '../components/PersonalAvatar';
import { supabaseClient } from '../config/supabase-client';
import eventBus from '../eventBus';
import ProfileDetail from '../components/ProfileDetail';
import { AxiosResponse } from 'axios';
import { createPicture, getPictureByProfileId, getProfileByAuthorEmail, updatePicture } from '../api';
import { useMutation, useQuery } from 'react-query';

const ProfilePage = () => {
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const toast = useToast();
  const [user, setUser] = useState<User | null>();
  const [isPublic, setIsPublic] = useState<boolean>();
  const [isUrlUploaded, setIsUrlUploaded] = useState<boolean>();
  const [profileId, setProfileId] = useState<number>()
  const [pictureId, setPictureId] = useState<number>()

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
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

  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(user?.email!)
    return res.data;
  };

  const { data: profileData, error: profileError, isLoading: isFetchingProfile } = useQuery(['profile'], fetchProfile, {
    enabled: false, onSuccess(res: IProfile) {
    },
    onError: () => {
      console.log(profileError)
    }
  });

  const fetchProfilePicture = async () => {
    const res: AxiosResponse<ApiDataType> = await getPictureByProfileId(profileId!)
    return res.data
  }

  const { data: pictureData, isLoading, error, isError, refetch } = useQuery(['profilePicture'], fetchProfilePicture, {
    enabled: false, onSuccess(res: IPicture) {
      if (res != null) {
        setAvatarUrl(res.avatarUrl)
        setPictureId(res.id)
      }
    },
    onError: () => {
      console.log(error)
    }
  })

  useEffect(() => {
    if (profileData) {
      setProfileId(profileData.id)
    }
  }, [profileData])

  useEffect(() => {
    if (profileId) {
      refetch()
    }
    if (isUrlUploaded) {
      updateProfile()
    }
  }, [profileId, isUrlUploaded])

  const postUpdateProfileUrl = async (): Promise<AxiosResponse> => {
    const picture: Omit<IPicture, 'id'> = {
      profileId: profileId!,
      avatarUrl: avatarUrl!
    };
    return await updatePicture(picture);
  }

  const { isLoading: isUpdatingProfileUrl, mutate: updateProfileUrl } = useMutation(
    postUpdateProfileUrl,
    {
      onSuccess: (res) => {
        toast({
          title: 'Picture updated.',
          position: 'top',
          variant: 'subtle',
          description: '',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        eventBus.dispatch('profileUpdated', true);
      },
      onError: (err) => {
        console.log(err)
      },
    }
  );

  const postCreateProfileUrl = async (): Promise<AxiosResponse> => {
    const picture: Omit<IPicture, 'id'> = {
      profileId: profileId!,
      avatarUrl: avatarUrl!
    };
    return await createPicture(picture);
  }

  const { isLoading: isCreatingProfileUrl, mutate: createProfileUrl } = useMutation(
    postCreateProfileUrl,
    {
      onSuccess: (res) => {
        toast({
          title: 'Picture created.',
          position: 'top',
          variant: 'subtle',
          description: '',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        eventBus.dispatch('profileUpdated', true);
      },
      onError: (err) => {
        console.log(err)
      },
    }
  );

  async function updateProfile() {
    try {
      setLoading(true);

      pictureId ? updateProfileUrl() : createProfileUrl();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCallBack = useCallback(
    (booleanFromChild: boolean) => {
      setIsPublic(booleanFromChild)
    },
    []
  );

  return (
    <div>
      <PersonalAvatar
        url={avatarUrl}
        disabled={!profileId}
        onUpload={(url: any) => {
          setAvatarUrl(url);
          setIsUrlUploaded(true)
        }}
      />
      <Box textAlign={'center'}>
        <Text fontSize={'sm'} fontWeight={500} color={'gray.500'} mb={4}>
          {session?.user?.email}
        </Text>
        <Badge ml='1' colorScheme={isPublic ? `green` : `gray`}>
          {isPublic ? `Public` : `Private`}
        </Badge>
      </Box>
      <ProfileDetail childToParent={handleCallBack} />
    </div>
  );
};

export default ProfilePage;
