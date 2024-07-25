import { useDocumentTitle } from "@mantine/hooks"

import { SignedIn } from "../signed-in"
import { LyricsFeatureflag } from "./lyrics-featureflag"
import { PageviewEvents } from "./pageview-events"
import { Pageviews } from "./pageviews"

export default function Charts() {
  useDocumentTitle("Charts")

  return (
    <SignedIn>
      <Pageviews />
      <LyricsFeatureflag />
      <PageviewEvents />
    </SignedIn>
  )
}
