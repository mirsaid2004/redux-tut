import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IPost } from './postsSlice';

export interface IPostEditState {
  post: IPost | null;
}

const initialState: IPostEditState = {
  post: null,
};

const postEditSlice = createSlice({
  name: 'postEdit',
  initialState,
  reducers: {
    startEditing(state, action: PayloadAction<IPost>) {
      state.post = action.payload;
    },
    stopEditing(state) {
      state.post = null;
    },
  },
});

export const { startEditing, stopEditing } = postEditSlice.actions;

export default postEditSlice.reducer;
