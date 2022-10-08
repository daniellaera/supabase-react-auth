import axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPost } from '../api';




const PostDetailPage = () => {
    //const [error, setError] = useState();
    const [post, setPost] = useState<AxiosResponse<any, any>>();
  //const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { id } = params;

  const fetchGroups = (): Promise<any> => getPost(Number(id))
    
  const { data , isLoading, error } = useQuery(['groups'], fetchGroups)
    



  return (
    <>
      {isLoading && <p>Loading post...</p>}
      {error && error}
      {JSON.stringify(data)}
    </>
  );
}

export default PostDetailPage;