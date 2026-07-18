import Festivals from "../../features/Festivals"
import { BASE_URL } from "@/constants"


export const revalidate = 600

async function getFestivalData(endpoint: string, year?: number) {
  try {
    const url = year ? `${BASE_URL}/${endpoint}?year=${year}` : `${BASE_URL}/${endpoint}`
    const response = await fetch(url, {
      next: { revalidate: 600 },
    })

    if (!response.ok) {
      return null
    }

    const text = await response.text()
    if (!text) return null

    return JSON.parse(text)
  } catch (error) {
    console.error("Data fetch failed:", error)
    return null
  }
}

export function generateMetadata() {
  return {
    title: 'Hindu Festivals: Complete Festival Calendar With Dates & Puja Timings',
    description: 'Explore the complete list of Hindu festivals with accurate dates, puja timings, vrat details, festival significance, rituals, stories, and regional celebrations in one place.',
  }
}

export default async function Page() {
  const year = new Date().getFullYear()
  const [festivalsData, vratKathasData] = await Promise.all([
    getFestivalData("festivals", year),
    getFestivalData("vrat-kathas"),
  ])

  const formatFestivalData = (data: any) => {
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
    return list.filter((item: any) => item?.Type === "Festival" || item?.attributes?.Type === "Festival")
  }

  return (
    <Festivals
      year={year}
      serverNow={Date.now()}
      festivalsData={festivalsData}
      vratKathasData={formatFestivalData(vratKathasData)}
    />
  )
}
