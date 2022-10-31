import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Progress,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import moment from 'moment';
import { truncate } from '../utils/functions';
import { ReadmoreButton } from './ReadMoreButton';
import LikeButton from './LikeButton';

function Posts({ posts }: any) {
  const color = useColorModeValue('white', 'gray.900');

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} w={1200} py={12} px={6}>
        {posts.map(({ id, createdAt, title, content, authorEmail }: any, i: number) => (
          <Center key={i} py={6}>
            <Box maxW={'800px'} w={'full'} bg={color} boxShadow={'2xl'} rounded={'md'} p={6} overflow={'hidden'}>
              <Stack>
                <Text color={'gray.500'}>{title}</Text>
                <Divider />
                <Text color={'gray.500'}>{content}</Text>
              </Stack>
              <Stack mt={10} direction={'row'} spacing={4} align={'center'}>
                <Avatar src="" name={truncate(authorEmail)} />
                <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                  <Text fontWeight={600}>{authorEmail}</Text>
                  <Text color={'gray.500'}>{moment(createdAt).format('Do MMMM YYYY')}</Text>
                </Stack>
              </Stack>

              {/*   <Stack mt={8} direction={'row'} spacing={6}>
                            {me && author.id === me.id && <DeleteButton id={id} post={post} />}
                        </Stack> */}

              <Stack direction={'row'} justify={'center'} spacing={6}>
                <Stack spacing={0} align={'center'}>
                  {/* <Text fontSize={'sm'} color={'gray.500'}>
                                    {likes?.length}
                                </Text> */}
                  
                </Stack>
                <Stack spacing={0} align={'center'}>
                  {/* <Text fontSize={'sm'} color={'gray.500'}>
                                    {comments?.length}
                                </Text> */}
                  {/* <CommentButton id={id} comments={comments} /> */}
                </Stack>
              </Stack>
              <Stack justify={'end'} mt={8} direction={'row'} spacing={4}>
              <LikeButton />
              <ReadmoreButton postId={id} />
              </Stack>
              
            </Box>
          </Center>
        ))}
      </Stack>
    </Flex>
  );
}

export default Posts;
