import axios, { AxiosResponse } from "axios"

const baseUrl: string = "http://localhost:5000/api/v1/posts"

export async function getPosts() {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch posts.')
  }
  return response.json();
}

export async function fetchPosts() {
  const { data } = await axios.get(baseUrl)
  return data
}

/* export async function savePost(post: any) {
  if (post.title.trim().length < 5 || post.content.trim().length < 10) {
    throw { message: 'Invalid input data provided.', status: 422 };
  }

  const response = await fetch(baseUrl + '/create', {
    method: 'POST',
    body: JSON.stringify(post),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw { message: 'Could not save post.', status: 500 };
  }
} */

/* 
  export const updateTodo = async (
    todo: IPost
  ): Promise<AxiosResponse> => {
    try {
      const todoUpdate: Pick<IPost, "status"> = {
        status: true,
      }
      const updatedTodo: AxiosResponse = await axios.put(
        `${baseUrl}/edit-todo/${todo._id}`,
        todoUpdate
      )
      return updatedTodo
    } catch (error: any) {
      throw new Error(error)
    }
  } */

  export const getPost = async (id: number): Promise<AxiosResponse> => {
    const response: AxiosResponse<ApiDataType> = await axios.get(
      baseUrl + '/post/' + id
    );
    return response
  }

  export const addTodo = async (formData: any): Promise<AxiosResponse<ApiDataType>> => {
    try {
      const todo: Omit<IPost, "id"> = {
        title: formData.title,
        content: formData.content,
        authorEmail: formData.authorEmail,
      }
      const saveTodo: AxiosResponse = await axios.post(
        baseUrl + "/create",
        todo
      )
      return saveTodo
    } catch (error: any) {
      throw new Error(error)
    }
  }
  
  export const deleteTodo = async (id: number): Promise<AxiosResponse> => {
    try {
      const deletedTodo: AxiosResponse<ApiDataType> = await axios.delete(
        `${baseUrl}/delete-todo/${id}`
      )
      return deletedTodo
    } catch (error:any) {
      throw new Error(error)
    }
  }
  