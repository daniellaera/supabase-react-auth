import {
  Badge,
  Box,
  Progress,
  Text,
  useToast
} from '@chakra-ui/react';
import { Session, } from '@supabase/supabase-js';
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
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const toast = useToast();
  const [isPublic, setIsPublic] = useState<boolean>();
  const [isUrlUploaded, setIsUrlUploaded] = useState<boolean>();
  const [profileId, setProfileId] = useState<number>()
  const [profile, setProfile] = useState<IProfile>()
  const [picture, setPicture] = useState<IPicture>()

  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(session?.user?.email!)
    return res.data;
  };

  const { data: profileData, error: profileError, isLoading: isFetchingProfile, refetch: refetchProfile } = useQuery(['profile'], fetchProfile, {
    enabled: true, retry: 2, cacheTime: 0, onSuccess(res: IProfile) {
    },
    onError: (error: any) => {
      console.log(error)
    }
  });

  const fetchProfilePicture = async () => {
    const res: AxiosResponse<ApiDataType> = await getPictureByProfileId(profile?.id!)
    return res.data
  }

  const { data: pictureData, isLoading, isError, refetch } = useQuery(['profilePicture'], fetchProfilePicture, {
    enabled: false, onSuccess(res: IPicture) {
    },
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
    };

    setData();

    if (profileData) {
      setProfile(profileData)
      setProfileId(profile?.id)
    }
    if (pictureData) {
      setPicture(pictureData)
    }
  }, [profileData, pictureData])

  useEffect(() => {

    if (isUrlUploaded) {
      updateProfile()
    }
  }, [isUrlUploaded])

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
      picture?.id ? updateProfileUrl() : createProfileUrl();
    } catch (error: any) {
      alert(error.message);
    }
  }

  const handleCallBack = useCallback(
    (booleanFromChild: boolean) => {
      setIsPublic(booleanFromChild)
    },
    []
  );

  if (isFetchingProfile) return <Progress size={'xs'} isIndeterminate />

  return (
    <div>
      <PersonalAvatar
        url={picture?.avatarUrl}
        disabled={!profile?.id}
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
  )
};

export default ProfilePage;
