import { useEffect, useState } from 'react';
import { fetchPosts } from '../api';
import { useQuery } from 'react-query'

import Posts from '../components/Posts';
import { Spinner } from '@chakra-ui/react';

function BlogPostsPage() {
  //const [error, setError] = useState();
  //const [posts, setPosts] = useState();
  //const [isLoading, setIsLoading] = useState(false);
  const { data, error, isError, isLoading } = useQuery('posts', fetchPosts)

  if (isLoading) {
    return <Spinner />
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
    <>
      <h1>Our Blog Posts</h1>
      {isLoading && <p>Loading posts...</p>}
      {error && <p>{error}</p>}
      {!error && data && <Posts posts={data} />}
    </>
  );
}

export default BlogPostsPage;