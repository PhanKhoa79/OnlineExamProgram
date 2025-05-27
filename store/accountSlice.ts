import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountResponse } from '@/features/account/types/account'
interface AccountState {
  accounts: AccountResponse[];
  selectedIds: number[];
}

const initialState: AccountState = {
  accounts: [],
  selectedIds: [],
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<AccountResponse[]>) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<AccountResponse>) => {
      state.accounts.unshift(action.payload);
    },
    updateAccount: (state, action: PayloadAction<AccountResponse>) => {
      const index = state.accounts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) state.accounts[index] = action.payload;
    },
    deleteAccount: (state, action: PayloadAction<number>) => {
      state.accounts = state.accounts.filter(a => a.id !== action.payload);
    },
    deleteAccounts: (state, action: PayloadAction<number[]>) => {
      const idsToDelete = action.payload;
      state.accounts = state.accounts.filter(a => !idsToDelete.includes(a.id));
      state.selectedIds = [];
    },
    setSelectedIds: (state, action: PayloadAction<number[]>) => {
      state.selectedIds = action.payload;
    },
    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },
  }
});

export const { setAccounts, addAccount, updateAccount, deleteAccount, setSelectedIds, clearSelectedIds, deleteAccounts } = accountSlice.actions;
export default accountSlice.reducer;
