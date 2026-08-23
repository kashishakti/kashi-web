import { Metadata } from "next"
import Enquiry from "../../features/Enquiry"

export const metadata: Metadata = {
  title: "Send an Enquiry | Kashi Shakti — Book a Pandit at Home in Noida",
  description:
    "Submit your pooja enquiry and our team will confirm a verified pandit, muhurat and pricing — usually within a few hours.",
}

export default function Page() {
  return <Enquiry />
}
