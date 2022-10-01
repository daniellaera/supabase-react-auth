import { Link } from 'react-router-dom';

function Posts({ posts }: any) {
  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>
          <Link to={post.id.toString()}>
            <h2>{post.title}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Posts;
