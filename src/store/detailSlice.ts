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
export const fetchPurnimaDetails = createAsyncThunk(
  'detail/fetchPurnimaDetails',
  async (slug: string) => {
    const response = await fetch(`${BASE_URL}/purnimas/slug/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch purnima details')
    }
    const data = await response.json()
    return data
  }
)
export const fetchAmavasyaDetails = createAsyncThunk(
  'detail/fetchAmavasyaDetails',
  async (slug: string) => {
    const response = await fetch(`${BASE_URL}/amavasyas/slug/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch amavasya details')
    }
    const data = await response.json()
    return data
  }
)
export const fetchPradoshDetails = createAsyncThunk(
  'detail/fetchPradoshDetails',
  async (slug: string) => {
    const response = await fetch(`${BASE_URL}/pradoshes/slug/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch pradosh details')
    }
    const data = await response.json()
    return data
  }
)

interface DetailState {
  ekadashiDetailData: any
  vratKathaDetailData: any
  purnimaDetailData: any
  amavasyaDetailData: any
  pradoshDetailData: any
  loading: boolean
  error: string | null
}

const initialState: DetailState = {
  ekadashiDetailData: null,
  vratKathaDetailData: null,
  purnimaDetailData: null,
  amavasyaDetailData: null,
  pradoshDetailData: null,
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
      .addCase(fetchPurnimaDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPurnimaDetails.fulfilled, (state, action) => {
        state.loading = false
        state.purnimaDetailData = action.payload
      })
      .addCase(fetchPurnimaDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
      })
      .addCase(fetchAmavasyaDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAmavasyaDetails.fulfilled, (state, action) => {
        state.loading = false
        state.amavasyaDetailData = action.payload
      })
      .addCase(fetchAmavasyaDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
      })
      .addCase(fetchPradoshDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPradoshDetails.fulfilled, (state, action) => {
        state.loading = false
        state.pradoshDetailData = action.payload
      })
      .addCase(fetchPradoshDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
      })
  },
})

export default detailSlice.reducer