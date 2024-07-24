import { useDocumentTitle } from "@mantine/hooks"

import { SignedIn } from "../signed-in"
import { LyricsFeatureflag } from "./lyrics-featureflag"
import { Pageviews } from "./pageviews"

export default function Charts() {
  useDocumentTitle("Charts")

  return (
    <SignedIn>
      <Pageviews />
      <LyricsFeatureflag />
    </SignedIn>
  )
}
