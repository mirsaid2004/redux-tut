import type { RootState } from '@/5.performance-optimizations/app/store';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

interface IUser {
  id: number;
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

export interface IUserState {
  id: string;
  name: string;
  email: string;
}

const requestUrl = 'https://jsonplaceholder.typicode.com';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch(`${requestUrl}/users`);
  const data = await response.json();
  return data as IUser[];
});

const initialState: Record<IUserState['id'], IUserState> = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      action.payload.forEach((user) => {
        state[user.id] = {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      });
    });
  },
});

// export const selectAllUsers = (state: RootState) => Object.values(state.users);
export const selectUserById = (state: RootState, userId: string) =>
  state.users[userId];

export const selectAllUsers = createSelector(
  (state: RootState) => state.users,
  (users) => Object.values(users),
);

export default usersSlice.reducer;
