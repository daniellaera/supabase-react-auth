import axios, { AxiosResponse } from 'axios';

const baseUrl: string = 'http://localhost:5000/api/v1/posts';
export const profileUrl: string = 'http://localhost:5000/api/v1/profile';

export async function getPosts() {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch posts.');
  }
  return response.json();
}

export async function fetchPosts() {
  const { data } = await axios.get(baseUrl);
  return data;
}

export const getPost = async (id: number): Promise<AxiosResponse> => {
  const response: AxiosResponse<ApiDataType> = await axios.get(baseUrl + '/post/' + id);
  return response;
};

export const getProfileByAuthorEmail = async (authorEmail: string): Promise<AxiosResponse>  => {
  const response: AxiosResponse<ApiDataType> = await axios.get(profileUrl + '/findProfileByEmail/' + authorEmail);
  return response;
};

export const addTodo = async (formData: any): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const todo: Omit<IPost, 'id'> = {
      title: formData.title,
      content: formData.content,
      authorEmail: formData.authorEmail
    };
    const saveTodo: AxiosResponse = await axios.post(baseUrl + '/create', todo);
    return saveTodo;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteTodo = async (id: number): Promise<AxiosResponse> => {
  try {
    const deletedTodo: AxiosResponse<ApiDataType> = await axios.delete(`${baseUrl}/delete-todo/${id}`);
    return deletedTodo;
  } catch (error: any) {
    throw new Error(error);
  }
};

export async function createProfile(profile: Omit<IProfile, 'id'>) {
  const response = await axios.post(`${profileUrl}/create`, profile);
  return response
}

export async function saveProfile(profile: IProfile) {
  const response = await axios.put(`${profileUrl}/updateById/${profile.id}`, profile);
  return response
}

export async function publishProfile(profileId: number) {
  const response = await axios.put(`${profileUrl}/publishProfile/${profileId}`);
  return response
}
