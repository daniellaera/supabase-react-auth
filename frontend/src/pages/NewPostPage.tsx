import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../config/supabase-client';
import { useMutation, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { addPost, getProfileByAuthorEmail } from '../api';
import { Session, User } from '@supabase/supabase-js';
import { Button, Container, Flex, FormControl, Heading, Input, Stack, useColorModeValue, useToast } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

function NewPostPage() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [session, setSession] = useState<Session | null>();
  const [user, setUser] = useState<User | null>();
  const [state, setState] = useState<'initial' | 'submitting' | 'success'>('initial');
  const [error, setError] = useState(false);
  const toast = useToast();
  const navigate = useNavigate()
  const [profile, setProfile] = useState<IProfile>()

  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(session?.user.email!)
    return res.data;
  };

  const { data: profileData, isLoading: isFetchingProfile, refetch } = useQuery(['profile'], fetchProfile, {
    enabled: false, onSuccess(res: IProfile) {
    },
    onError: (err) => {
      console.log(err)
    }
  });

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
      // console.log(JSON.stringify(session?.access_token))
    };

    setData();
  }, []);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData)
    }

    // declare the data fetching function
    const fetchUserData = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser()
      setUser(user)
    }

    // call the function
    fetchUserData()
      // make sure to catch any error
      .catch(console.error);
  }, [profileData])

  const createPost = async (): Promise<AxiosResponse> => {
    const post: Omit<IPost, 'id'> = {
      title: postTitle,
      content: postContent,
      profileId: profile?.id!,
    }
    return await addPost(post, session?.access_token!);
  }

  const { isLoading: isPostingTutorial, mutate: postTutorial } = useMutation(createPost, {
    onSuccess(res) {
      toast({
        title: 'Post created.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
  })

  function postData() {
    try {
      postTutorial()
    } catch (err) {
      //setPostResult(fortmatResponse(err));
    }
  }

  return (
    <Flex minH={'20vh'} align={'center'} justify={'center'} mt={8}>
      <Container
        maxW={'lg'}
        bg={useColorModeValue('white', 'whiteAlpha.100')}
        boxShadow={'xl'}
        rounded={'lg'}
        p={6}
      >
        <Heading as={'h2'} fontSize={{ base: 'xl', sm: '2xl' }} textAlign={'center'} mb={5}>
          Wha do you have in mind?
        </Heading>
        <Stack

          as={'form'}
          spacing={'30'}
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();

            try {
              if (postTitle.length < 1 || postContent.length < 1) {
                setError(true);
                toast({
                  position: 'top',
                  title: 'An error occured',
                  description: `${error}`,
                  status: 'error',
                  duration: 5000,
                  isClosable: true
                });
                return;
              }
            } catch (error) {
              toast({
                position: 'top',
                title: 'An error occured',
                description: `${error}`,
                duration: 5000,
                status: 'error',
                isClosable: true
              });
            }

            setError(false);
            setState('submitting');

            setTimeout(() => {
              setState('success');
            }, 1000);
            setTimeout(() => {
              navigate('/posts')
            }, 2000);
          }}
        >
          <FormControl>
            <Input
              variant={'solid'}
              borderWidth={1}
              color={'white.800'}
              _placeholder={{ color: 'gray.400' }}
              borderColor={useColorModeValue('gray.300', 'gray.700')}
              id={'text'}
              type={'text'}
              required
              placeholder={'your title here'}
              aria-label={'your title here'}
              value={postTitle}
              disabled={state !== 'initial' && state !== 'success'}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPostTitle(e.target.value)}
            ></Input>
          </FormControl>
          <FormControl>
            <Input
              variant={'solid'}
              borderWidth={1}
              color={'white.800'}
              _placeholder={{ color: 'gray.400' }}
              borderColor={useColorModeValue('gray.300', 'gray.700')}
              id={'text'}
              type={'text'}
              required
              placeholder={'your content here'}
              aria-label={'your content here'}
              value={postContent}
              disabled={state !== 'initial' && state !== 'success'}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPostContent(e.target.value)}
            ></Input>
          </FormControl>
          <FormControl w={{ base: '100%', md: '40%' }}>
            <Button
              colorScheme={state === 'success' ? 'green' : 'blue'}
              isLoading={state === 'submitting'}
              w={'100%'}
              type={state === 'success' ? 'button' : 'submit'}
              onClick={postData}
            >
              {state === 'success' ? <CheckIcon /> : 'Submit'}
            </Button>
          </FormControl>
        </Stack>
      </Container>
    </Flex>
  );
}

export default NewPostPage;
