import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Todo {
  userId: number;
  id: string;
  title: string;
  completed: boolean;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], string>({
      query: () => '/todos',
      transformResponse: (response: Todo[]) =>
        response.sort((a, b) => +b.id - +a.id),
      providesTags: ['Todos'],
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: todo,
      }),
      //   invalidatesTags: ['Todos'],
      async onQueryStarted(_newTodo, { dispatch, queryFulfilled }) {
        try {
          const { data: addedTodo } = await queryFulfilled;
          if (addedTodo) {
            dispatch(
              apiSlice.util.updateQueryData('getTodos', 'todos', (draft) => {
                draft.unshift(addedTodo);
              }),
            );
          }
        } catch (error) {
          console.error('Failed to add todo:', error);
        }
      },
    }),
    updateTodo: builder.mutation<void, Partial<Todo>>({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: 'PUT',
        body: todo,
      }),
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
