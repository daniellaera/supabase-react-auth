import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Spinner,
  Image,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Session } from '@supabase/supabase-js';

import { AxiosResponse } from 'axios';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { addLike, getPost } from '../api';
import LikeButton from '../components/LikeButton';
import ProfileAvatar from '../components/ProfileAvatar';

interface Props {
  session: Session | null | undefined
}

const PostDetailPage = ({ session }: Props) => {
  const color = useColorModeValue('white', 'gray.900');
  const color2 = useColorModeValue('gray.700', 'white');
  const toast = useToast();

  const [post, setPost] = useState<IPost>();
  const params = useParams();
  const { id } = params;

  const postAddLike = async (): Promise<AxiosResponse> => {
    const like: Omit<ILike, 'id'> = {
      postId: post?.id!,
      profileId: post?.profileId!
    };
    console.log(like)
    return await addLike(like, session?.access_token!);
  }

  const { isLoading: isPostingTutorial, mutate: postLike } = useMutation(postAddLike, {
    onSuccess(res) {
      //console.log('liked', res)
      toast({
        title: 'Liked.',
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
    }
  })

  const fetchPost = async (): Promise<AxiosResponse> => getPost(Number(id))

  const { data, error, isError, isLoading, refetch } = useQuery('post', fetchPost, {
    enabled: true, retry: 2, cacheTime: 0, onSuccess(res: any) {
      setPost(res.data)
    },
    onError: (error: any) => {
      console.log(error)
    },
  })

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return <div>Error! {(error as Error).message}</div>
  }

  function handleLikeCallback(): void {
    postLike()
  }

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} w={1200} py={6} px={6}>
        <Center py={6}>
          <Box maxW={'800px'} w={'full'} bg={color} boxShadow={'2xl'} rounded={'md'} p={6} overflow={'hidden'}>
            <Stack>
              <Text
                color={'green.500'}
                textTransform={'uppercase'}
                fontWeight={800}
                fontSize={'sm'}
                letterSpacing={1.1}>
                Blog
              </Text>
              <Heading
                color={color2}
                fontSize={'2xl'}
                fontFamily={'body'}>
                {post?.title}
              </Heading>
              <Text color={'gray.500'}>
                {post?.content}
              </Text>
            </Stack>
            <Stack mt={10} direction={'row'} spacing={4} align={'center'}>
              <ProfileAvatar url={post?.profile?.picture?.avatarUrl} avatarName={post?.profile?.authorEmail} />
              <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                <Text fontWeight={600}>{post?.profile?.authorEmail}</Text>
                <Text color={'gray.500'}>{moment(post?.createdAt).format('Do MMMM YYYY')}</Text>
              </Stack>
            </Stack>
            <Stack justify={'end'} direction={'row'} spacing={4}>
              <LikeButton isDisabled={false} onClick={handleLikeCallback} likesCount={post?.likes?.length} />
            </Stack>
          </Box>
        </Center>
      </Stack>
    </Flex>
  );
}

export default PostDetailPage;