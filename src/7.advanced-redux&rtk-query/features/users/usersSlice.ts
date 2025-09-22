import { type RootState } from '../../app/store';
import {
  createEntityAdapter,
  createSelector,
  type EntityState,
} from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

const usersAdapter = createEntityAdapter<IUser>();

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<IUser, string>, void>({
      query: () => '/users',
      transformResponse: (responseData: IUser[]) => {
        return usersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) => [
        { type: 'User', id: 'LIST' },
        ...(result?.ids.map((id) => ({ type: 'User' as const, id })) || []),
      ],
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data,
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  (state: RootState) => selectUsersData(state) ?? initialState,
);
