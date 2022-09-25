interface IPost {
    _id: string
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
    todos: IPost[]
    todo?: IPost
  }
  