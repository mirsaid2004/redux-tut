import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IPostState } from './postsSlice';

export interface IPostEditState {
  post: IPostState | null;
}

const initialState: IPostEditState = {
  post: null,
};

const postEditSlice = createSlice({
  name: 'postEdit',
  initialState,
  reducers: {
    startEditing(state, action: PayloadAction<IPostState>) {
      state.post = action.payload;
    },
    stopEditing(state) {
      state.post = null;
    },
  },
});

export const { startEditing, stopEditing } = postEditSlice.actions;

export default postEditSlice.reducer;
