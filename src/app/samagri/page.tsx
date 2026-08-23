import { Suspense } from "react"
import { Metadata } from "next"
import Samagri from "@/features/Samagri"

export const metadata: Metadata = {
  title: "Samagri Delivery | Kashi Shakti",
  description:
    "Upload your pandit's list or choose a ready pooja kit. Assembled and delivered to your door in 24–48 hours.",
}

export default function SamagriPage() {
  return (
    <Suspense>
      <Samagri />
    </Suspense>
  )
}
