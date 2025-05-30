import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoleWithPermissionsDto } from '@/features/role/types/role';
interface RoleState {
  roles: RoleWithPermissionsDto[];

}

const initialState: RoleState = {
  roles: [],
}

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<RoleWithPermissionsDto[]>) => {
      state.roles = action.payload;
    },
    addRole: (state, action: PayloadAction<RoleWithPermissionsDto>) => {
      state.roles.unshift(action.payload);
    },
    updateRole: (state, action: PayloadAction<RoleWithPermissionsDto>) => {
      const index = state.roles.findIndex(a => a.name === action.payload.name);
      if (index !== -1) state.roles[index] = action.payload;
    },
  }
});

export const { setRoles, addRole, updateRole } = roleSlice.actions;
export default roleSlice.reducer;
