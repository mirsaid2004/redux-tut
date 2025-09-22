import type { RootState } from '@/7.advanced-redux&rtk-query/app/store';
import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import dayjs from 'dayjs';
import type { PartiallyOptional } from '@/types/partially-optional';

export interface IPost {
  id: string;
  title: string;
  body: string;
  userId: string;
  date: string;
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
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<EntityState<IPost, string>, void>({
      query: () => '/posts',
      transformResponse: (responseData: IPost[]) => {
        return postsAdapter.setAll(
          postsAdapter.getInitialState(),
          responseData,
        );
      },
      providesTags: (result) => {
        return result?.ids.map((id) => ({ type: 'Post' as const, id })) || [];
      },
    }),
    getPostsByUserId: builder.query<EntityState<IPost, string>, void>({
      query: (userId) => `/posts?userId=${userId}`,
      transformResponse: (
        responseData: PartiallyOptional<IPost, 'reactions' | 'date'>[],
      ) => {
        const min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.date)
            post.date = dayjs()
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
      Omit<IPost, 'id' | 'date' | 'reactions'>
    >({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          id: Math.random().toString(36).substring(2, 9),
          date: dayjs().toISOString(),
          reactions: { like: 0, love: 0, wow: 0 },
        },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation<IPost, Omit<IPost, 'date' | 'reactions'>>({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: 'PATCH',
        body: { ...initialPost, editedAt: dayjs().toISOString() },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    reactToPost: builder.mutation<
      IPost,
      { postId: string; reactions: IPost['reactions'] }
    >({
      query: ({ postId, reactions }) => ({
        url: `/posts/${postId}`,
        method: 'PATCH',
        body: { reactions },
      }),
      // invalidatesTags: (_result, _error, { postId }) => [
      //   { type: 'Post', id: postId },
      // ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              extendedApiSlice.util.updateQueryData(
                'getPosts',
                undefined,
                (draft) => {
                  const post = draft.entities[data.id];
                  if (post) post.reactions = data.reactions;
                },
              ),
            );
          }
        } catch (error) {
          console.error('Failed to react to post:', error);
        }
      },
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
      invalidatesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
  }),
});

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data ?? initialState,
);

// CREATE THE ADAPTER SELECTORS ONCE - THIS IS THE KEY FIX
const adapterSelectors = postsAdapter.getSelectors();

// Now use the pre-created selectors - NO MORE postsAdapter.getSelectors() calls
export const selectAllPosts = createSelector(selectPostsData, (postsData) =>
  adapterSelectors.selectAll(postsData),
);

export const selectPostIds = createSelector(selectPostsData, (postsData) =>
  adapterSelectors.selectIds(postsData),
);

export const selectPostById = createSelector(
  [selectPostsData, (_state: RootState, postId: string) => postId],
  (postsData, postId) => adapterSelectors.selectById(postsData, postId),
);

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
  (posts, userId) => posts.filter((post) => post.userId === userId),
);
