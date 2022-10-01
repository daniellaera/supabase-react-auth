import { useEffect, useState } from 'react';
import { getPosts } from '../api';

import Posts from '../components/Posts';

function BlogPostsPage() {
    const [error, setError] = useState();
    const [posts, setPosts] = useState();
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const posts = await getPosts();
        setPosts(posts);
      } catch (err: any) {
        setError(err.message);
      }
      setIsLoading(false);
    }

    loadPosts();
  }, []);

  return (
    <>
      <h1>Our Blog Posts</h1>
      {isLoading && <p>Loading posts...</p>}
      {error && <p>{error}</p>}
      {!error && posts && <Posts posts={posts} />}
    </>
  );
}

export default BlogPostsPage;