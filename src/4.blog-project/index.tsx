import { Provider } from 'react-redux';
import { store } from './app/store';
import PostsList from './features/posts/PostsList';
import PostForm from './features/posts/PostForm';
import { fetchUsers } from './features/users/usersSlice';

store.dispatch(fetchUsers());

function Index() {
  return (
    <Provider store={store}>
      <section>
        <h1>Async logic and thunks </h1>
        <PostForm />
        <PostsList />
      </section>
    </Provider>
  );
}

export default Index;
