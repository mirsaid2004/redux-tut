import { Provider } from 'react-redux';
import { store } from './app/store';
import PostsList from './features/posts/PostsList';
import PostForm from './features/posts/PostForm';

function Index() {
  return (
    <Provider store={store}>
      <section>
        <h1>App structure and data-flow </h1>
        <PostForm />
        <PostsList />
      </section>
    </Provider>
  );
}

export default Index;
