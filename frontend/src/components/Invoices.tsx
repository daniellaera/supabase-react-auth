import { EditIcon } from '@chakra-ui/icons';
import {
  Box, Progress, useToast,
  Heading,
  Text,
  Stack,
  Button,
  Badge,
  useColorModeValue,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Tag,
  TagLabel,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  HStack
} from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { createProfile, getProfileByAuthorEmail, publishProfile, saveProfile, getPictureByProfileId } from '../api';
import { supabaseClient } from '../config/supabase-client';
import { getRandomColor } from '../utils/functions';
import PersonalAvatar from './PersonalAvatar';
import { AsyncSelect, MultiValue } from 'chakra-react-select';
import { pickListOptions } from '../config/pickListOptions';
import { FaAddressBook, FaCheck } from 'react-icons/fa';

const mappedColourOptions = pickListOptions.map(option => ({
  ...option,
  colorScheme: option.color
}));

const Invoices = () => {
  //const [session, setSession] = useState<Session | null>();
  const [profile, setProfile] = useState<IProfile>()
  const [picture, setPicture] = useState<IPicture>()
  const [username, setUsername] = useState<string>();
  const [website, setWebsite] = useState<string>();
  const [company, setCompany] = useState<string>();
  const [profileId, setProfileId] = useState<number>()
  const [authorEmail, setAuthorEmail] = useState<string>();
  const [user, setUser] = useState<User>()
  const [isEditingLanguage, setIsEditingLanguage] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>();
  const [languages, setLanguages] = useState<IProgrammingLanguage[] | undefined>();
  const [newParams, setNewParams] = useState<any[]>([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null);

  const color3 = useColorModeValue('gray.50', 'gray.800')
  const color4 = useColorModeValue('white', 'gray.700')

  const fetchProfilePicture = async () => {
    const res: AxiosResponse<ApiDataType> = await getPictureByProfileId(profile?.id!)
    return res.data
  }

  const { data: pictureData, isLoading, isError, refetch: refetchPicture } = useQuery(['profilePicture'], fetchProfilePicture, {
    enabled: false, retry: 2, cacheTime: 0, onSuccess(res: IPicture) {
      setPicture(res)
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        position: 'top',
        variant: 'subtle',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  })

  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(user?.email!)
    return res.data;
  };

  const { data: profileData, error: profileError, isLoading: isFetchingProfile, refetch: refetchProfile } = useQuery(['profile'], fetchProfile, {
    enabled: false, retry: 2, cacheTime: 0, onSuccess(res: IProfile) {
      if (res != null) {
        setUsername(res.username)
        setWebsite(res.website)
        setCompany(res.company)
        setProfileId(res.id)
        setIsPublic(res.isPublic)
        setAuthorEmail(res.authorEmail)
        if (res.programmingLanguages.length !== newParams.length) {
          res.programmingLanguages.forEach(obj => {
            newParams.push(obj.language)
          })
        }
        setLanguages(newParams)
        setIsEditingLanguage(false)
      } else {
        setIsEditingLanguage(true)
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        position: 'top',
        variant: 'subtle',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const postCreateProfile = async (): Promise<AxiosResponse> => {
    const profile: Omit<IProfile, 'id'> = {
      website: website!,
      username: username!,
      company: company!,
      authorEmail: user?.email!,
      programmingLanguages: languages!
    };
    return await createProfile(profile);
  }

  const { isLoading: isCreatingProfile, mutate: postProfile } = useMutation(postCreateProfile, {
    onSuccess(res) {
      toast({
        title: 'Profile created.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      refetchProfile()
    }
  });

  const postUpdateProfile = async (): Promise<AxiosResponse> => {
    const profile: IProfile = {
      website: website!,
      username: username!,
      company: company!,
      authorEmail: user?.email!,
      id: profileId!,
      programmingLanguages: languages!
    };
    return await saveProfile(profile);
  }

  const { isLoading: isUpdatingProfile, mutate: updateProfile } = useMutation(
    postUpdateProfile,
    {
      onSuccess: (res) => {
        toast({
          title: 'Profile updated.',
          position: 'top',
          variant: 'subtle',
          description: '',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        refetchProfile()
      },
      onError: (err) => {
        console.log(err)
      },
      //onMutate: () => console.log('mutating')
    }
  );

  const postPublishProfile = async (): Promise<AxiosResponse> => {
    return await publishProfile(profileId!);
  }

  const { isLoading: isPublishingProfile, mutate: publish } = useMutation(
    postPublishProfile,
    {
      onSuccess: (res) => {
        toast({
          title: 'Profile published.',
          position: 'top',
          variant: 'subtle',
          description: '',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        refetchProfile()
      },
      onError: (err) => {
        console.log(err)
      },
      //onMutate: () => console.log('mutating')
    }
  );

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      //setSession(session);
      if (session) {
        setUser(session.user)
      }
    };

    setData();
  }, []);

  useEffect(() => {
    if (user) {
      //console.log('user->', user)
      refetchProfile()
    }
    if (profile) {
      //console.log('prof', profile)
      refetchPicture()
    }
    if (picture) {
      //console.log('pic pic', picture)
    }
  }, [user, refetchProfile, profile, refetchPicture, picture])

  if (isFetchingProfile) {
    return <Progress size={'xs'} isIndeterminate />
  }

  function publishMe() {
    onClose()
    publish();
  }

  function postData() {
    try {
      if (profileId) {
        updateProfile()
      } else {
        postProfile()
      }
    } catch (err) {
      //setPostResult(fortmatResponse(err));
    }
  }

  const editLanguage = () => {
    setNewParams([])
    setIsEditingLanguage(true)
  }

  function handleLanguages(e: MultiValue<{ colorScheme: string; value: string; label: string; color: string; }>) {
    let newParams: any[] = []
    for (let i = 0; i < e.length; i += 1) {
      const obje = e[i].value
      newParams.push(obje)
    }

    setLanguages(newParams)
  }

  return (
    <Flex
      justify={'center'}
      bg={color3}>
      <Stack
        spacing={4}
        w={'full'}
        maxW='xl'
        bg={color4}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize='2xl' alignSelf='center'>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <PersonalAvatar
            url={picture?.avatarUrl}
            disabled={!profile?.id}

          />
          <Box textAlign={'center'}>
            <Text fontSize={'sm'} fontWeight={500} color={'gray.500'} mb={4}>
              {authorEmail}
            </Text>
            <Badge ml='1' colorScheme={isPublic ? `green` : `gray`}>
              {isPublic ? `Public` : `Private`}
            </Badge>
          </Box>
        </FormControl>
        <FormControl id="userName">
          <FormLabel>username</FormLabel>
          <Input
            placeholder={username || 'username'}
            type="text"
            value={username || ''}
            onChange={(e: any) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="website">
          <FormLabel>website</FormLabel>
          <Input
            placeholder={website || 'website'}
            type="text"
            value={website || ''}
            onChange={(e: any) => setWebsite(e.target.value)}
          />
        </FormControl>
        <FormControl id="company">
          <FormLabel>company</FormLabel>
          <Input
            placeholder={company || 'company'}
            type="text"
            value={company || ''}
            onChange={(e: any) => setCompany(e.target.value)}
          />
        </FormControl>
        {isEditingLanguage ? (<FormControl pb={10}>
          <FormLabel>Select programming languages that you like most</FormLabel>
          <AsyncSelect
            onChange={(e) => handleLanguages(e)}
            isMulti
            name="colors"
            options={mappedColourOptions}
            placeholder="ex: Java, GoLang"
            closeMenuOnSelect={false}
            size="md"
            loadOptions={(inputValue, callback) => {
              setTimeout(() => {
                const values = mappedColourOptions.filter((i) =>
                  i.label.toLowerCase().includes(inputValue.toLowerCase()),
                );
                callback(values);
              }, 3000);
            }}
          />
        </FormControl>) : (
          <>
            <FormLabel>Programming languages</FormLabel>
            <HStack spacing={4}>
              {Object.entries(newParams)
                .map(
                  ([key, value]) => (<Tag colorScheme={getRandomColor()} key={key}><TagLabel>{value}</TagLabel></Tag>)
                )
              }
              <Button onClick={() => editLanguage()} leftIcon={<EditIcon />} colorScheme='pink' variant='ghost'>
                Edit
              </Button>
            </HStack>
          </>)}
          <Stack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6} direction={['column', 'row']}>
              {!isPublic && profileId && <Button
                onClick={onOpen}
                leftIcon={<FaAddressBook />}
                fontFamily={'heading'}
                w={'full'}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={'white'}
                _hover={{
                  bgGradient: 'linear(to-r, red.400,pink.400)',
                  boxShadow: 'xl',
                }}>
                Publish profile
              </Button>}
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Publish Profile
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        spinnerPlacement="start"
                        isLoading={isPublishingProfile}
                        colorScheme='blue'
                        onClick={() => publishMe()} ml={3}>
                        {isPublishingProfile || 'Publish'}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
              <Button
                leftIcon={<FaCheck />}
                isLoading={isCreatingProfile || isUpdatingProfile}
                loadingText={profileId ? `Updating` : `Creating`}
                onClick={postData}
                disabled={!username || !website || !languages}
                bg={'blue.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'blue.500',
                }}>
                {profileId ? `Update` : `Save`}
              </Button>
            </Stack>
      </Stack>
    </Flex>
  );
}

export default Invoices