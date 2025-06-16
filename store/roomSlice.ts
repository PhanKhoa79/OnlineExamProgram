import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoomDto } from '@/features/room/types/room'

interface RoomState {
  rooms: RoomDto[]
}

const initialState: RoomState = {
  rooms: []
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<RoomDto[]>) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action: PayloadAction<RoomDto>) => {
      state.rooms.push(action.payload)
    },
    updateRoom: (state, action: PayloadAction<RoomDto>) => {
      const index = state.rooms.findIndex(room => room.id === action.payload.id)
      if (index !== -1) {
        state.rooms[index] = action.payload
      }
    },
    removeRoom: (state, action: PayloadAction<number>) => {
      state.rooms = state.rooms.filter(room => room.id !== action.payload)
    }
  }
})

export const { setRooms, addRoom, updateRoom, removeRoom } = roomSlice.actions
export default roomSlice.reducer 