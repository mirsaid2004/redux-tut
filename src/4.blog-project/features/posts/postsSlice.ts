import type { RootState } from '@/3.async-logic-and-thunks/app/store';
import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const requestUrl = 'https://jsonplaceholder.typicode.com';

interface IPostFromApi {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface IPost {
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

export interface IPostState {
  posts: IPost[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await fetch(`${requestUrl}/posts`);
  const data = await response.json();
  return data as IPostFromApi[];
});

export const fetchPostById = async (postId: string) => {
  const response = await fetch(`${requestUrl}/posts/${postId}`);
  const data = await response.json();
  return data as IPostFromApi;
};

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (newPost: Omit<IPostFromApi, 'id'>) => {
    const response = await fetch(`${requestUrl}/posts`, {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    return data as IPostFromApi;
  },
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (updatedPost: IPostFromApi) => {
    try {
      const response = await fetch(`${requestUrl}/posts/${updatedPost.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      return data as IPostFromApi;
    } catch (err) {
      console.error('Failed to update post:', err);
      return updatedPost;
    }
  },
);

export const deletePostFromApi = createAsyncThunk(
  'posts/deletePostFromApi',
  async (postId: string) => {
    const response = await fetch(`${requestUrl}/posts/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    return postId;
  },
);

const initialState: IPostState = {
  posts: [],
  status: 'idle',
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action: PayloadAction<IPost>) {
        state.posts.push(action.payload);
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
        action: PayloadAction<Omit<IPost, 'publishedAt' | 'reactions'>>,
      ) {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id,
        );
        if (index !== -1) {
          state.posts[index] = { ...state.posts[index], ...action.payload };
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
      const index = state.posts.findIndex((post) => post.id === action.payload);
      if (index !== -1) {
        state.posts.splice(index, 1);
      }
    },
    reactToPost(
      state,
      action: PayloadAction<{
        postId: string;
        reaction: keyof IPost['reactions'];
      }>,
    ) {
      const { postId, reaction } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPosts.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Something went wrong';
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';

      const loadedPosts = action.payload.map(
        (post) =>
          ({
            id: String(post.id),
            title: post.title,
            content: post.body,
            authorId: String(post.userId),
            publishedAt: dayjs().toISOString(),
            reactions: {
              like: 0,
              love: 0,
              wow: 0,
            },
          }) as IPost,
      );

      state.posts = loadedPosts;
    });
    builder.addCase(addNewPost.fulfilled, (state, action) => {
      const post = action.payload;
      state.posts.push({
        id: String(post.id),
        title: post.title,
        content: post.body,
        authorId: String(post.userId),
        publishedAt: dayjs().toISOString(),
        reactions: {
          like: 0,
          love: 0,
          wow: 0,
        },
      });
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex(
        (post) => post.id === String(updatedPost.id),
      );
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          title: updatedPost.title,
          content: updatedPost.body,
          authorId: String(updatedPost.userId),
          editedAt: dayjs().toISOString(),
        };
      }
    });
    builder.addCase(deletePostFromApi.fulfilled, (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    });
  },
});

export const selectAllPosts = (state: RootState) => state.postsData.posts;
export const selectPostById = (state: RootState, postId: string) =>
  state.postsData.posts.find((post) => post.id === postId);
export const getPostsStatus = (state: RootState) => state.postsData.status;
export const getPostsError = (state: RootState) => state.postsData.error;

export const { addPost, editPost, deletePost, reactToPost } =
  postsSlice.actions;

export default postsSlice.reducer;
