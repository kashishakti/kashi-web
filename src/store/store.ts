import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './globalSlice'
import homeReducer from './homeSlice'
import detailReducer from './detailSlice'

export const store = configureStore({
  reducer: {
    global: globalReducer,
    home: homeReducer,
    detail: detailReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
