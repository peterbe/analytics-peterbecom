import { useDocumentTitle } from "@mantine/hooks"
import { Link } from "wouter"
import { Box, Button, Group } from "@mantine/core"

import { SignedIn } from "./signed-in"

export function Home() {
  useDocumentTitle("Home")

  return (
    <SignedIn>
      <Box m={100}>
        <Group justify="center">
          <Button size="xl" component={Link} to="/query">
            Query
          </Button>
          <Button size="xl" component={Link} to="/charts">
            Charts
          </Button>
        </Group>
      </Box>
    </SignedIn>
  )
}
