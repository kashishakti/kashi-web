"use client"

import { useSelector } from "react-redux"
import type { RootState } from '../store/store'
import Loading from "./Loading"

export default function GlobalLoader() {
  const { loading: globalLoading } = useSelector((state: RootState) => state.global)
  const { loading: detailLoading } = useSelector((state: RootState) => state.detail)
  const { loading: homeLoading } = useSelector((state: RootState) => state.home)

  if (!globalLoading && !detailLoading && !homeLoading) return null

  return <Loading />
}