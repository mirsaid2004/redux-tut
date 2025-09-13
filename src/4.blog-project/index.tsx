import { Provider } from 'react-redux';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { store } from './app/store';
import { fetchUsers } from './features/users/usersSlice';
import { fetchPosts } from './features/posts/postsSlice';

store.dispatch(fetchUsers());
store.dispatch(fetchPosts());

function Index() {
  return (
    <Provider store={store}>
      <Header />
      <Outlet />
    </Provider>
  );
}

export default Index;
