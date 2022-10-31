import { useEffect, useState } from 'react';
import { fetchPosts } from '../api';
import { useQuery } from 'react-query'

import Posts from '../components/Posts';
import { Button, Heading, Progress, Spinner, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

function BlogPostsPage() {
  //const [error, setError] = useState();
  //const [posts, setPosts] = useState();
  //const [isLoading, setIsLoading] = useState(false);
  const { data, error, isError, isLoading } = useQuery('posts', fetchPosts)

  if (isLoading) {
    return <Progress size={'xs'} isIndeterminate />
  }
  if (isError) {
    return <div>Error! {(error as Error).message}</div>
  }

  /* useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const posts = await fetchPosts();
        setPosts(posts);
      } catch (err: any) {
        setError(err.message);
      }
      setIsLoading(false);
    }

    loadPosts();
  }, []); */

  return (
    <Stack spacing={0} align={'center'}>
      <Heading>Our Developers Speak</Heading>
      <Text>We have been working with Developers around the world</Text>
      {isLoading && <p>Loading posts...</p>}
      {error && <p>{error}</p>}
      {!error && data && <Posts posts={data} />}
    </Stack>
  );
}

export default BlogPostsPage;