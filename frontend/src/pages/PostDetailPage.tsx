import { Spinner } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPost } from '../api';

const PostDetailPage = () => {
    //const [error, setError] = useState();
    const [post, setPost] = useState<AxiosResponse<ApiDataType>>();
  //const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { id } = params;

  const fetchPost = (): Promise<AxiosResponse> => getPost(Number(id))
    
  const { data, isLoading, error, isError } = useQuery(['post'], fetchPost, {onSuccess(res) {
      setPost(res.data)
  },})

  if (isLoading) {
    return <Spinner />
  }
  if (isError) {
    return <div>Error! {(error as Error).message}</div>
  }

  return (
    <>
      {isLoading && <p>Loading post...</p>}
      {error && error}
      {JSON.stringify(post)}
    </>
  );
}

export default PostDetailPage;