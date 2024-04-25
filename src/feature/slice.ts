import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
interface DataType {
    key?: React.Key;
    preName?: string;
    name?: string;
    surName?: string
    date?: string;
    nationality?: string;
    personalId?: number;
    sex?: string;
    phone?: string;
    passport?: string;
    salary?: string;
  } 
export interface DataState {
  value: DataType | null,
}

const initialState: DataState = {
  value: null,
}

export const dataSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<DataType>) => {
      state.value = action.payload
      console.log("set",state.value)
    },
  },
})

// Action creators are generated for each case reducer function
export const {  setData } = dataSlice.actions

export default dataSlice.reducer