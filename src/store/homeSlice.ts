import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../constants'

export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async () => {
    const response = await fetch(`${BASE_URL}/landing-page-full`)
    if (!response.ok) {
      throw new Error('Failed to fetch landing page data')
    }
    const data = await response.json()
    return data
  }
)

interface HomeState {
  homeData: any
  loading: boolean
  error: string | null
}

const initialState: HomeState = {
  homeData: null,
  loading: false,
  error: null,
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false
        state.homeData = action.payload
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
      })
  },
})

export default homeSlice.reducer