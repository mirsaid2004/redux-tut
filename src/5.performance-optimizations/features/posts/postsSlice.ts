import type { RootState } from '@/5.performance-optimizations/app/store';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  count: number;
}

const postsAdapter = createEntityAdapter<IPost>({
  sortComparer: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
});

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

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
  count: 0,
} as IPostState);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactToPost(
      state,
      action: PayloadAction<{
        postId: string;
        reaction: keyof IPost['reactions'];
      }>,
    ) {
      const { postId, reaction } = action.payload;
      const post = state.entities[postId];
      if (post) {
        post.reactions[reaction]++;
      }
    },
    increaseCount(state) {
      state.count += 1;
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

      postsAdapter.upsertMany(state, loadedPosts);
    });
    builder.addCase(addNewPost.fulfilled, (state, action) => {
      const post = action.payload;
      postsAdapter.addOne(state, {
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

      postsAdapter.updateOne(state, {
        id: String(updatedPost.id),
        changes: {
          title: updatedPost.title,
          content: updatedPost.body,
          authorId: String(updatedPost.userId),
          editedAt: dayjs().toISOString(),
        },
      });
    });
    builder.addCase(deletePostFromApi.fulfilled, (state, action) => {
      postsAdapter.removeOne(state, action.payload);
    });
  },
});

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>((state) => state.postsData);

// export const filterPostsByUserId = (state: RootState, userId: string) =>
//   state.postsData.posts.filter((post) => post.authorId === userId);
export const getPostsStatus = (state: RootState) => state.postsData.status;
export const getPostsError = (state: RootState) => state.postsData.error;

export const filterPostsByUserId = createSelector(
  [selectAllPosts, (_: RootState, userId: string) => userId],
  (posts, userId) => posts.filter((post) => post.authorId === userId),
);

export const { reactToPost, increaseCount } = postsSlice.actions;

export default postsSlice.reducer;
