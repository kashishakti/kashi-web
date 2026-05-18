"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchGlobalData, fetchNextEkadashiData } from "../store/globalSlice"
import { AppDispatch } from "../store/store"

export default function GlobalDataInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
      dispatch(fetchGlobalData())
      dispatch(fetchNextEkadashiData())
  }, [])

  return null
}