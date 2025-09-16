import { useAppSelector } from '@/7.advanced-redux&rtk-query/app/hooks';

type AuthorNameProps = {
  authorId?: string;
};

function AuthorName({ authorId }: AuthorNameProps) {
  const users = useAppSelector((state) => state.users);
  const author = authorId && users[authorId];

  return <i>{author ? author.name : 'Unknown Author'}</i>;
}

export default AuthorName;
