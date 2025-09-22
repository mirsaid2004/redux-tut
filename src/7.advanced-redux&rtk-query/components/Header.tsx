import type { CSSProperties } from 'react';
import { NavLink } from 'react-router';

const navList = [
  { title: 'Posts', path: '/lesson/advanced-redux-and-rtk-query' },
  {
    title: 'Create Post',
    path: '/lesson/advanced-redux-and-rtk-query/create-post',
  },
  { title: 'Users', path: '/lesson/advanced-redux-and-rtk-query/users' },
];

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  marginBottom: '40px',
  padding: '10px 20px',
  backgroundColor: '#333',
  borderBottom: '2px solid #ccc',
};

const navWrapperStyle: CSSProperties = {
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  listStyle: 'none',
};

function Header() {
  return (
    <div style={headerStyle}>
      <h1 style={{ margin: 10 }}>Blog Project</h1>

      <ul style={navWrapperStyle}>
        {navList.map((item) => (
          <li key={item.path}>
            <NavLink
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              to={item.path}
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Header;
