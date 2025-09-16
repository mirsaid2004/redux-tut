import { Link } from 'react-router';
import { useAppSelector } from '../app/hooks';
import { selectAllUsers } from '../features/users/usersSlice';
import type { CSSProperties } from 'react';

const usersListWrapperStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

function UsersList() {
  const users = useAppSelector(selectAllUsers);

  const renderUsers = users.map((user) => (
    <li key={user.id}>
      <Link to={`/lesson/advanced-redux-and-rtk-query/users/${user.id}`}>
        {user.name} ({user.email})
      </Link>
    </li>
  ));

  return (
    <div style={usersListWrapperStyle}>
      <h2>Users List</h2>
      <ul>{renderUsers}</ul>
    </div>
  );
}

export default UsersList;
