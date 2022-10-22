import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, Flex, FormControl, FormLabel, HStack, Input, Stack, Tag, TagLabel, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { Session, User } from '@supabase/supabase-js';
import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { addProfile, getProfileByAuthorEmail, profileUrl, saveProfile } from '../api';
import { supabaseClient } from '../config/supabase-client';
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { FaAddressBook, FaCheck } from 'react-icons/fa';
import { AsyncSelect, MultiValue, Select } from 'chakra-react-select';
import { pickListOptions } from '../config/pickListOptions';

const mappedColourOptions = pickListOptions.map(option => ({
  ...option,
  colorScheme: option.color
}));

interface Props {
  isPublished?: boolean;
  childToParent(success: boolean): any;
}

const ProfileDetail = ({ childToParent }: Props) => {
  const [username, setUsername] = useState<string>('');
  const [languages, setLanguages] = useState<IProgrammingLanguage[] | undefined>();
  const [website, setWebsite] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>();
  const [isEditing, setIsEditing] = useState<boolean>();
  const [profileId, setProfileId] = useState<number>()
  const [user, setUser] = useState<User | null>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // declare the data fetching function
    const fetchUserData = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser()
      setUser(user)
    }
    // call the function
    fetchUserData()
      // make sure to catch any error
      .catch(console.error);
  }, [])

  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(user?.email!)
    return res.data;
  };

  const { status, data, error, refetch } = useQuery(['profile'], fetchProfile, {
    enabled: false, onSuccess(res: IProfile) {
      if (res != null) {
        setUsername(res.username)
        setWebsite(res.website)
        setProfileId(res.id)
        childToParent(res.isPublic ? true : false);
        setIsPublic(res.isPublic)
        res.programmingLanguages.forEach(obj => {
          let letters = ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'pink', 'cyan'];
          let color = '';
          for (let i = 0; i < 6; i++) {
            color = letters[Math.floor(Math.random() * letters.length)];
          }
          obj.color = color;
        });
        setLanguages(res.programmingLanguages)
        setIsEditing(false)
        //console.log('fetchedColourOptions', fetchedColourOptions)
      }
    }
  });

  const createProfile = (): Promise<AxiosResponse> =>
    addProfile({ website: website, username: username, authorEmail: user?.email, programmingLanguages: languages });

  const { isLoading: isPostingProfile, mutate: postProfile } = useMutation(createProfile, {
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
    }
  });

  const postUpdateProfile = async (): Promise<AxiosResponse> => {
    const profile: IProfile = {
      website: website,
      username: username,
      authorEmail: user?.email,
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
        refetch()
      },
      onError: (err) => {
        console.log(err)
      },
      //onMutate: () => console.log('mutating')
    }
  );

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

  function handleLanguages(e: MultiValue<{ colorScheme: string; value: string; label: string; color: string; }>) {
    let newParams: any[] = []
    for (let i = 0; i < e.length; i += 1) {
      const obje = e[i].value
      newParams.push(obje)
      setLanguages(newParams)
      setIsEditing(true)
    }
  }

  const emptyLanguages = () => {
    setLanguages([])
  }

  useEffect(() => {
    //console.log(languages?.map(i => i.color))
  }, [languages])

  return (
    <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
      <Accordion allowToggle={true}>
        <AccordionItem>
          <AccordionButton _expanded={{ bgGradient: 'linear(to-r, teal.500, green.500)', color: 'white' }} onClick={() => refetch()}>
            <Box flex='1' textAlign='left'>
              Show profile
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={6} px={6}>
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
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={6} px={6}>
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
            <Stack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6}>
              <FormControl pb={10}>
                <FormLabel>Select programming languages that you like most</FormLabel>
                <AsyncSelect
                  onChange={(e) => handleLanguages(e)}
                  onMenuOpen={emptyLanguages}
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
              </FormControl>
              <HStack spacing={4}>
                {!isEditing && languages?.map((language, index) => (
                  <Tag  key={index} variant='subtle' colorScheme={language.color}>
                    <TagLabel>{language.language}</TagLabel>
                  </Tag>
                ))}
              </HStack>
            </Stack>
            <Stack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6} direction={['column', 'row']}>
              {!isPublic && <Button
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
                      Delete Customer
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button colorScheme='red' onClick={onClose} ml={3}>
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
              <Button
                leftIcon={<FaCheck />}
                isLoading={isPostingProfile || isUpdatingProfile}
                loadingText={profileId ? `Updating` : `Creating`}
                onClick={postData}
                disabled={!username || !website}
                bg={'blue.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'blue.500',
                }}>
                {profileId ? `Update` : `Save`}
              </Button>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Container>
  );
};

export default ProfileDetail;
