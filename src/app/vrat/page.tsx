import VratFestivalsPage from "../../features/Vrat"
import { BASE_URL } from "@/constants"

export const revalidate = 600

async function getVratData(endpoint: string, year?: number) {
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
    title: 'Hindu Vrat Calendar: All Ekadashi, Purnima, Amavasya & Pradosh Dates',
    description: 'Find the complete Hindu Vrat Calendar with all Ekadashi, Purnima, Amavasya, Pradosh Vrat and other fasting dates. Get vrat timings, puja vidhi, vrat katha, fasting rules, and significance in one place.',
  }
}

const VALID_TABS = ['ekadashi', 'pradosh', 'purnima', 'amavasya', 'vratkatha'] as const

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const year = new Date().getFullYear()
  const params = await searchParams
  const tabParam = params?.tab
  const initialTab = VALID_TABS.includes(tabParam as any) ? (tabParam as typeof VALID_TABS[number]) : undefined

  const [ekadashisData, purnimasData, amavasyasData, pradoshesData, vratKathasData] = await Promise.all([
    getVratData("ekadashis", year),
    getVratData("purnimas", year),
    getVratData("amavasyas", year),
    getVratData("pradoshes", year),
    getVratData("vrat-kathas"),
  ])

  const formatVratData = (data: any) => {
    return data?.filter((item: any) => item?.Type === "Ekadashi" || item?.Type === "Purnima" || item?.Type === "Amavasya" || item?.Type === "Pradosh")
  }

  return (
    <VratFestivalsPage
      year={year}
      serverNow={Date.now()}
      initialTab={initialTab}
      ekadashisData={ekadashisData}
      purnimasData={purnimasData}
      amavasyasData={amavasyasData}
      pradoshesData={pradoshesData}
      vratKathasData={formatVratData(vratKathasData)}
    />
  )
}
