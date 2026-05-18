import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../constants'

export const fetchEkadashiDetails = createAsyncThunk(
  'detail/fetchEkadashiDetails',
  async (slug: string) => {
    const response = await fetch(`${BASE_URL}/ekadashis/slug/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch ekadashi details')
    }
    const data = await response.json()
    return data
  }
)
export const fetchVratKathaDetails = createAsyncThunk(
  'detail/fetchVratKathaDetails',
  async (slug: string) => {
    const response = await fetch(`${BASE_URL}/vrat-kathas/slug/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch vrat katha details')
    }
    const data = await response.json()
    return data
  }
)

interface DetailState {
  ekadashiDetailData: any
  vratKathaDetailData: any
  loading: boolean
  error: string | null
}

const initialState: DetailState = {
  ekadashiDetailData: null,
  vratKathaDetailData: null,
  loading: false,
  error: null,
}

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEkadashiDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEkadashiDetails.fulfilled, (state, action) => {
        state.loading = false
        state.ekadashiDetailData = action.payload
      })
      .addCase(fetchEkadashiDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
      })
      .addCase(fetchVratKathaDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVratKathaDetails.fulfilled, (state, action) => {
        state.loading = false
        state.vratKathaDetailData = action.payload
      })
      .addCase(fetchVratKathaDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
      })
  },
})

export default detailSlice.reducer