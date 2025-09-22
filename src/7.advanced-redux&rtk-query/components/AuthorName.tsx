import { useAppSelector } from '@/7.advanced-redux&rtk-query/app/hooks';
import { selectUserById } from '../features/users/usersSlice';

type AuthorNameProps = {
  authorId?: string;
};

function AuthorName({ authorId }: AuthorNameProps) {
  const author = useAppSelector((state) => selectUserById(state, authorId!));

  return <i>{author ? author.name : 'Unknown Author'}</i>;
}

export default AuthorName;
