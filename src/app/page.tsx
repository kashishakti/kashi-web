import { Metadata } from "next"
import Home from "../features/home/Home"

export const metadata: Metadata = {
  title: "Kashi Shakti | Hindu Spiritual Knowledge, Sacred Products & Consulting",
  description:
    "Book a pandit for your pooja at home in Noida. Get experienced, verified pandits, pooja samagri included, quick booking, and clear, fair pricing.",
}

export default function Page() {
  return <Home />
}
