import { Link, useParams } from 'react-router';
import { useAppSelector } from '../app/hooks';
import { filterPostsByUserId } from '../features/posts/postsSlice';
import type { CSSProperties } from 'react';

const userPostsWrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'center',
};

function User() {
  const params = useParams();
  const user = useAppSelector((state) => state.users[params.userId!]);
  const userPosts = useAppSelector((state) =>
    filterPostsByUserId(state, params.userId!),
  );

  return (
    <div style={userPostsWrapperStyle}>
      <h2>{user?.name}</h2>
      <p>Email: {user?.email}</p>
      <h3>Posts by {user?.name}</h3>
      <ul>
        {userPosts.map((post) => (
          <li key={post.id}>
            <Link to={`/lesson/advanced-redux-and-rtk-query/post/${post.id}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default User;
