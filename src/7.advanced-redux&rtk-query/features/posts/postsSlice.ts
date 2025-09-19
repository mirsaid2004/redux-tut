import type { RootState } from '@/7.advanced-redux&rtk-query/app/store';
import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import dayjs from 'dayjs';
import type { PartiallyOptional } from '@/types/partially-optional';

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

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<EntityState<IPost, string>, void>({
      query: () => '/posts',
      transformResponse: (
        responseData: PartiallyOptional<IPost, 'reactions' | 'publishedAt'>[],
      ) => {
        const min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.publishedAt)
            post.publishedAt = dayjs()
              .subtract(Math.floor(Math.random() * 10) + min, 'day')
              .toISOString();
          if (!post.reactions) post.reactions = { like: 0, love: 0, wow: 0 };
          return post as IPost;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        return result?.ids.map((id) => ({ type: 'Post' as const, id })) || [];
      },
    }),
    getPostsByUserId: builder.query<EntityState<IPost, string>, string>({
      query: (userId) => `/posts?userId=${userId}`,
      transformResponse: (
        responseData: PartiallyOptional<IPost, 'reactions' | 'publishedAt'>[],
      ) => {
        const min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.publishedAt)
            post.publishedAt = dayjs()
              .subtract(Math.floor(Math.random() * 10) + min, 'day')
              .toISOString();
          if (!post.reactions) post.reactions = { like: 0, love: 0, wow: 0 };
          return post as IPost;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => [
        { type: 'Post', id: 'LIST' },
        ...(result?.ids.map((id) => ({ type: 'Post' as const, id })) || []),
      ],
    }),
    addNewPost: builder.mutation<
      IPost,
      Omit<IPost, 'id' | 'publishedAt' | 'reactions'>
    >({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          id: Math.random().toString(36).substring(2, 9),
          publishedAt: dayjs().toISOString(),
          reactions: { like: 0, love: 0, wow: 0 },
        },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation<
      IPost,
      Omit<IPost, 'publishedAt' | 'reactions'>
    >({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: 'PATCH',
        body: { ...initialPost, editedAt: dayjs().toISOString() },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    reactToPost: builder.mutation<
      IPost,
      { postId: string; reaction: keyof IPost['reactions'] }
    >({
      query: ({ postId, reaction }) => ({
        url: `/posts/${postId}/reactions`,
        method: 'POST',
        body: { reactions: { [reaction]: 1 } },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Post', id: postId },
      ],
    }),
    deletePostFromApi: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Post', id: arg }],
    }),
  }),
});

// const postsSlice = createSlice({
//   name: 'posts',
//   initialState,
//   reducers: {
//     reactToPost(
//       state,
//       action: PayloadAction<{
//         postId: string;
//         reaction: keyof IPost['reactions'];
//       }>,
//     ) {
//       const { postId, reaction } = action.payload;
//       const post = state.entities[postId];
//       if (post) {
//         post.reactions[reaction]++;
//       }
//     },
//     increaseCount(state) {
//       state.count += 1;
//     },
//   },
//   extraReducers(builder) {
//     builder.addCase(fetchPosts.pending, (state) => {
//       state.status = 'loading';
//     });
//     builder.addCase(fetchPosts.rejected, (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message || 'Something went wrong';
//     });
//     builder.addCase(fetchPosts.fulfilled, (state, action) => {
//       state.status = 'succeeded';

//       const loadedPosts = action.payload.map(
//         (post) =>
//           ({
//             id: String(post.id),
//             title: post.title,
//             content: post.body,
//             authorId: String(post.userId),
//             publishedAt: dayjs().toISOString(),
//             reactions: {
//               like: 0,
//               love: 0,
//               wow: 0,
//             },
//           }) as IPost,
//       );

//       postsAdapter.upsertMany(state, loadedPosts);
//     });
//     builder.addCase(addNewPost.fulfilled, (state, action) => {
//       const post = action.payload;
//       postsAdapter.addOne(state, {
//         id: String(post.id),
//         title: post.title,
//         content: post.body,
//         authorId: String(post.userId),
//         publishedAt: dayjs().toISOString(),
//         reactions: {
//           like: 0,
//           love: 0,
//           wow: 0,
//         },
//       });
//     });
//     builder.addCase(updatePost.fulfilled, (state, action) => {
//       const updatedPost = action.payload;

//       postsAdapter.updateOne(state, {
//         id: String(updatedPost.id),
//         changes: {
//           title: updatedPost.title,
//           content: updatedPost.body,
//           authorId: String(updatedPost.userId),
//           editedAt: dayjs().toISOString(),
//         },
//       });
//     });
//     builder.addCase(deletePostFromApi.fulfilled, (state, action) => {
//       postsAdapter.removeOne(state, action.payload);
//     });
//   },
// });

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data ?? initialState,
);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>((state) => selectPostsData(state));

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useDeletePostFromApiMutation,
  useAddNewPostMutation,
  useReactToPostMutation,
  useUpdatePostMutation,
} = extendedApiSlice;
// export const filterPostsByUserId = (state: RootState, userId: string) =>
//   state.postsData.posts.filter((post) => post.authorId === userId);

export const filterPostsByUserId = createSelector(
  [selectAllPosts, (_: RootState, userId: string) => userId],
  (posts, userId) => posts.filter((post) => post.authorId === userId),
);
