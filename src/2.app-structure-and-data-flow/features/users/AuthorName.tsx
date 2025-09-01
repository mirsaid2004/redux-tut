import { useAppSelector } from '@/2.app-structure-and-data-flow/app/hooks';

type AuthorNameProps = {
  authorId?: string;
};

function AuthorName({ authorId }: AuthorNameProps) {
  const users = useAppSelector((state) => state.users);
  const author = authorId && users[authorId];

  return <i>{author ? author.name : 'Unknown Author'}</i>;
}

export default AuthorName;
