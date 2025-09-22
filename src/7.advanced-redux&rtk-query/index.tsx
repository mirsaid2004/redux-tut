import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { store } from './app/store';
import { usersApiSlice } from './features/users/usersSlice';
import { extendedApiSlice } from './features/posts/postsSlice';

store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());

function Index() {
  const renderCount = useRef(0);
  renderCount.current++;

  // Move the initialization inside useEffect to run only once
  useEffect(() => {
    console.log(
      `🔄 Index (AdvancedReduxAndRTKQuery) re-render #${renderCount.current}`,
    );
  });

  return (
    <Provider store={store}>
      <Header />
      <Outlet />
    </Provider>
  );
}

export default Index;
