import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePost } from '../api';
import NewPostForm from '../components/NewPostForm';
import { supabaseClient } from '../config/supabase-client';

function NewPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  async function submitHandler(event: any) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
        const user = supabaseClient.auth.user();

      const formData = new FormData(event.target);
      const post = {
        title: formData.get('title'),
        content: formData.get('content'),
        authorEmail: user?.email
      };
      await savePost(post);
      navigate('/');
    } catch (err: any) {
      setError(err);
    }
    setIsSubmitting(false);
  }

  function cancelHandler() {
    navigate('/blog');
  }

  return (
    <>
      {error && <p>{error}</p>}
      <NewPostForm
        onCancel={cancelHandler}
        onSubmit={submitHandler}
        submitting={isSubmitting}
      />
    </>
  );
}

export default NewPostPage;
