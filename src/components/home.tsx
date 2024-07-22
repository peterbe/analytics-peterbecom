import { useDocumentTitle } from "@mantine/hooks"

import { Query } from "./query"
import { SignedIn } from "./signed-in"

export function Home() {
  useDocumentTitle("Home")

  return (
    <SignedIn>
      <Query />
    </SignedIn>
  )
}
