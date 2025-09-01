import { createSlice } from '@reduxjs/toolkit';

export interface IUserState {
  id: string;
  name: string;
  email: string;
}

const initialState: Record<IUserState['id'], IUserState> = {
  '1': { id: '1', name: 'John Doe', email: 'john@example.com' },
  '2': { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  '3': { id: '3', name: 'Alice Johnson', email: 'alice@example.com' },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
});

export default usersSlice.reducer;
