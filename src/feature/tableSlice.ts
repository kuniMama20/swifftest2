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
export interface TableState {
  value: DataType | null,
}

const initialState: TableState = {
  value: null,
}

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setTable: (state, action: PayloadAction<DataType>) => {
        state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {  setTable } = tableSlice.actions

export default tableSlice.reducer