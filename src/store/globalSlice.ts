import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../constants'

export const fetchGlobalData = createAsyncThunk(
  'global/fetchGlobalData',
  async () => {
    const response = await fetch(`${BASE_URL}/global-full`)
    if (!response.ok) {
      throw new Error('Failed to fetch global data')
    }
    const data = await response.json()
    return data
  }
)

export const fetchNextEkadashiData = createAsyncThunk(
  'global/fetchNextEkadashiData',
  async () => {
    const response = await fetch(`${BASE_URL}/upcoming-events`)
    if (!response.ok) {
      throw new Error('Failed to fetch next ekadashi data')
    }
    const data = await response.json()
    return data
  }
)

interface GlobalState {
  globalData: any
  nearestData: any
  loading: boolean
  error: string | null
}

const initialState: GlobalState = {
  globalData: null,
  nearestData: null,
  loading: false,
  error: null,
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGlobalData.fulfilled, (state, action) => {
        state.loading = false
        state.globalData = action.payload
      })
      .addCase(fetchGlobalData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
      })
      .addCase(fetchNextEkadashiData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNextEkadashiData.fulfilled, (state, action) => {
        state.loading = false
        state.nearestData = action.payload
      })
      .addCase(fetchNextEkadashiData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
      })
  },
})

export default globalSlice.reducer