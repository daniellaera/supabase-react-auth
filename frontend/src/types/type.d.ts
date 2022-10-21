interface IPost {
  id: number;
  authorEmail: string;
  title: string;
  content: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface IProfile {
  id: number;
  authorEmail: string | undefined;
  website: string;
  username: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TodoProps {
  todo: IPost;
}

type ApiDataType = {
  message: string;
  status: string;
  posts?: IPost[];
  todo?: IPost;
  profile?: IProfile
};

type GetPostsResponse = {
  posts: IPost[];
};

interface ProtectedRouteProps {
  children: ReactNode;
  session: any;
  signedIn: boolean;
}

interface ProfilePageProps {
  childToParent?: boolean;
}
