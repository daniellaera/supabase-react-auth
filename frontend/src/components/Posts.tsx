import { Link } from 'react-router-dom';
import { Avatar, Box, Center, Divider, Flex, Progress, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import moment from 'moment';
import { truncate } from '../utils/functions';

function Posts({ posts }: any) {
  const color = useColorModeValue('white', 'gray.900');

  return posts ? (
    <Flex align={'center'} justify={'center'}>
        <Stack spacing={8} mx={'auto'} w={1200} py={12} px={6}>
            {posts.map(({ id, createdAt, title, content, authorEmail }: any, i: number) => (
                <Center key={i} py={6}>
                    <Box maxW={'800px'} w={'full'} bg={color} boxShadow={'2xl'} rounded={'md'} p={6} overflow={'hidden'}>
                        <Stack>
                            <Text
                                color={'green.500'}
                                textTransform={'uppercase'}
                                fontWeight={800}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Post
                            </Text>
                            <Text color={'gray.500'}>{title}</Text>
                            <Divider />
                            <Text color={'gray.500'}>{content}</Text>
                        </Stack>
                        <Stack mt={10} direction={'row'} spacing={4} align={'center'}>
                            <Avatar src='' name={truncate(authorEmail)} />
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
                                {/* <LikeButton childToParent={handleClick} id={id} authorId={authorId} /> */}
                            </Stack>
                            <Stack spacing={0} align={'center'}>
                                {/* <Text fontSize={'sm'} color={'gray.500'}>
                                    {comments?.length}
                                </Text> */}
                                {/* <CommentButton id={id} comments={comments} /> */}
                            </Stack>
                        </Stack>

                        {/* <ReadmoreButton id={id} comments={comments} /> */}
                    </Box>
                </Center>
            ))}
        </Stack>
    </Flex>
) : (
    <Progress size={'xs'} isIndeterminate />
)
}

export default Posts;
