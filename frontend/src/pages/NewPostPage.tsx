import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../config/supabase-client';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { addTodo } from '../api';
import { User } from '@supabase/supabase-js';
import { useToast } from '@chakra-ui/react';

function NewPostPage() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [user, setUser] = useState<User | null>();
  const toast = useToast();

  useEffect(() => {
    // declare the data fetching function
    const fetchUserData = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser()
      setUser(user)
    }

    // call the function
    fetchUserData()
      // make sure to catch any error
      .catch(console.error);
  }, [])

  // const userEmail: string | undefined = supabaseClient.auth.getUser()?.email


  const createTodo = (): Promise<AxiosResponse> => addTodo({ title: postTitle, content: postContent, authorEmail: user?.email })

  const { isLoading: isPostingTutorial, mutate: postTutorial } = useMutation(createTodo, {
    onSuccess(res) {
      toast({
        title: 'Post created.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
  })

  // const navigate = useNavigate()

  // const [postResult, setPostResult] = useState<any>(null);

  /* const fortmatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  }; */

  /* const { isLoading: isPostingTutorial, mutate: postTutorial } = useMutation(
    async () => {
      return await axios.post(`http://localhost:5000/api/v1/posts/create`, {
        title: postTitle,
        content: postContent,
        authorEmail: user?.email
      });
    },
    {
      onSuccess: (res) => {
        const result = {
          status: res.status + "-" + res.statusText,
          headers: res.headers,
          data: res.data,
        };

        navigate('/posts')

        setPostResult(fortmatResponse(result));
      },
      onError: (err: any) => {
        setPostResult(fortmatResponse(err.response?.data || err));
      },
    }
  ); */

  /* useEffect(() => {
    if (isPostingTutorial) setPostResult("posting...");
  }, [isPostingTutorial]); */

  function postData() {
    try {
      postTutorial()
    } catch (err) {
      //setPostResult(fortmatResponse(err));
    }
  }

  /* const clearPostOutput = () => {
    setPostResult(null);
  }; */

  return (
    <div id="app" className="container">
      <div className="card">
        <div className="card-header">React Query Axios POST </div>
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="form-control"
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="form-control"
              placeholder="Description"
            />
          </div>
          <button className="btn btn-sm btn-primary" onClick={postData}>
            Post Data
          </button>
          {/* <button
          className="btn btn-sm btn-warning ml-2"
          onClick={clearPostOutput}
        >
          Clear
        </button> */}

          {/* {postResult && (
          <div className="alert alert-secondary mt-2" role="alert">
            <pre>{postResult}</pre>
          </div>
        )} */}
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
