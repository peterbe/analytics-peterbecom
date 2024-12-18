import { Grid, Text } from "@mantine/core"
import { Link } from "wouter"

import { useUserData } from "../whoami/use-userdata"

export function Nav() {
  const { userData } = useUserData()

  return (
    <Grid>
      <Grid.Col span={8}>
        ANALYTICS - <Link href="/">Home</Link> -{" "}
        <Link href="/query">Query</Link> - <Link href="/charts">Charts</Link>
      </Grid.Col>
      <Grid.Col span={4}>
        <Text ta="right">
          {userData?.user ? userData?.user.username : "Anonymous"}
        </Text>
      </Grid.Col>
    </Grid>
  )
}
