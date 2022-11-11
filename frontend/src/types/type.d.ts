interface IPost {
  id: number;
  authorEmail: string;
  title: string;
  content: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface IProgrammingLanguage {
  createdAt?: string;
  id: number;
  language: string;
  profileId: number;
  color?: string;
}

interface IPicture {
  id: number;
  profileId: number;
  avatarUrl: string;
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
  isPublic?: boolean;
  avatarUrl?: string;
  programmingLanguages: IProgrammingLanguage[];
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
  picture?: IPicture
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

interface ReadMoreButtonProps {
  postId: number;
}