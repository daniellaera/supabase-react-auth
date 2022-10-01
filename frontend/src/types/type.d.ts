interface IPost {
    id: number
    authorEmail: string
    title: string
    content: string;
    status?: boolean
    createdAt?: string
    updatedAt?: string
  }
  
  interface TodoProps {
    todo: IPost
  }
  
  type ApiDataType = {
    message: string
    status: string
    posts: IPost[]
    todo?: IPost
  }

  type GetPostsResponse = {
    posts: IPost[]
  };
  