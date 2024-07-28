import { useDocumentTitle } from "@mantine/hooks"

import { SignedIn } from "../signed-in"
import { LyricsFeatureflag } from "./lyrics-featureflag"
import { MinimizeContext } from "./minimize-context"
import { PageviewEvents } from "./pageview-events"
import { Pageviews } from "./pageviews"
import { useMinimized } from "./use-minimized"

export default function Charts() {
  useDocumentTitle("Charts")

  const [minimized, toggleMinimized] = useMinimized()
  return (
    <SignedIn>
      <MinimizeContext.Provider value={{ minimized, toggleMinimized }}>
        <Pageviews />
        <LyricsFeatureflag />
        <PageviewEvents />
      </MinimizeContext.Provider>
    </SignedIn>
  )
}
