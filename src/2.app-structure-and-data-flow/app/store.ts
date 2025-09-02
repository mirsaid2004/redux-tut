import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import usersReducer from '../features/users/usersSlice';
import postEditReducer from '../features/posts/postEditSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    postEdit: postEditReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
