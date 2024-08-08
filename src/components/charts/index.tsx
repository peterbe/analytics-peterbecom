import { useDocumentTitle } from "@mantine/hooks"

import { SignedIn } from "../signed-in"
import { GeoLocations } from "./geo-locations"
import { LyricsFeatureflag } from "./lyrics-featureflag"
import { MinimizeContext } from "./minimize-context"
import { PageviewEvents } from "./pageview-events"
import { PageviewNumbers } from "./pageview-numbers"
import { Pageviews } from "./pageviews"
import { RenderingPerformance } from "./rendering-performance"
import { useMinimized } from "./use-minimized"

export default function Charts() {
  useDocumentTitle("Charts")

  const [minimized, toggleMinimized] = useMinimized()
  return (
    <SignedIn>
      <MinimizeContext.Provider value={{ minimized, toggleMinimized }}>
        <PageviewNumbers />
        <Pageviews />
        <LyricsFeatureflag />
        <PageviewEvents />
        <RenderingPerformance />
        <GeoLocations />
      </MinimizeContext.Provider>
    </SignedIn>
  )
}
