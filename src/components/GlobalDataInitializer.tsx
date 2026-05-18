"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchGlobalData, fetchNextEkadashiData } from "../store/globalSlice"
import { AppDispatch, RootState } from "../store/store"
import { usePathname } from "next/navigation"

export default function GlobalDataInitializer() {
  const dispatch = useDispatch<AppDispatch>()
  const pathname = usePathname()

  const { globalData, nearestData } = useSelector(
    (state: RootState) => state.global
  )

  useEffect(() => {
    if (!globalData) {
      dispatch(fetchGlobalData())
    }

    if (!nearestData) {
      dispatch(fetchNextEkadashiData())
    }
  }, [dispatch, globalData, nearestData, pathname])

  return null
}