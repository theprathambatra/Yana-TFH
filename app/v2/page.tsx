import type { Metadata } from "next";
import { V2Landing } from "@/components/v2/V2Landing";

export const metadata: Metadata = {
  title: "Register for French Classes",
  description: "Explore TEF, TCF and DELF coaching with Yana Budhiraja and register your interest for a small online batch.",
};

export default function V2Page() {
  return <V2Landing />;
}
