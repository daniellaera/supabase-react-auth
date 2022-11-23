import { fetchPosts } from '../api';
import { useQuery } from 'react-query'

import Posts from '../components/Posts';
import { Progress } from '@chakra-ui/react';

function BlogPostsPage() {
  const { data, error, isError, isLoading } = useQuery('posts', fetchPosts)

  if (isLoading) {
    return <Progress size={'xs'} isIndeterminate />
  }
  if (isError) {
    return <div>Error! {(error as Error).message}</div>
  }

  return (
    <>
      {isLoading && <p>Loading posts...</p>}
      {error && <p>{error}</p>}
      {!error && data && <Posts posts={data} />}
    </>
  );
}

export default BlogPostsPage;