import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export interface IPostState {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  publishedAt: string;
  editedAt?: string;
  reactions: {
    like: number;
    love: number;
    wow: number;
  };
}

const initialState: IPostState[] = [
  {
    id: '1',
    title: 'First Post',
    content: 'This is the content of the first post.',
    publishedAt: dayjs().subtract(3, 'days').toISOString(),
    reactions: {
      like: 0,
      love: 0,
      wow: 0,
    },
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'This is the content of the second post.',
    publishedAt: dayjs().subtract(2, 'days').toISOString(),
    reactions: {
      like: 0,
      love: 0,
      wow: 0,
    },
  },
  {
    id: '3',
    title: 'Third Post',
    content: 'This is the content of the third post.',
    publishedAt: dayjs().subtract(10, 'minutes').toISOString(),
    reactions: {
      like: 0,
      love: 0,
      wow: 0,
    },
  },
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action: PayloadAction<IPostState>) {
        state.push(action.payload);
      },
      prepare: (title: string, content: string, authorId: string) => {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            authorId,
            publishedAt: dayjs().toISOString(),
            reactions: {
              like: 0,
              love: 0,
              wow: 0,
            },
          },
        };
      },
    },
    editPost: {
      reducer(
        state,
        action: PayloadAction<Omit<IPostState, 'publishedAt' | 'reactions'>>,
      ) {
        const index = state.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state[index] = { ...state[index], ...action.payload };
        }
      },
      prepare(id: string, title: string, content: string, authorId: string) {
        return {
          payload: {
            id,
            title,
            content,
            authorId,
            editedAt: dayjs().toISOString(),
          },
        };
      },
    },
    deletePost(state, action: PayloadAction<string>) {
      const index = state.findIndex((post) => post.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    reactToPost(
      state,
      action: PayloadAction<{
        postId: string;
        reaction: keyof IPostState['reactions'];
      }>,
    ) {
      const { postId, reaction } = action.payload;
      const post = state.find((post) => post.id === postId);
      if (post) {
        post.reactions[reaction]++;
      }
    },
  },
});

export const { addPost, editPost, deletePost, reactToPost } =
  postsSlice.actions;

export default postsSlice.reducer;
