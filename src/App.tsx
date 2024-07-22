// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css"
import "@mantine/charts/styles.css"
import "./styles/globals.css"

import { MantineProvider } from "@mantine/core"
import { Container } from "@mantine/core"

import { Nav } from "./components/simple-nav"
import { UserDataProvider } from "./contexts/user-context"
import { Routes } from "./routes"

export default function App() {
  return (
    <MantineProvider defaultColorScheme={"light"}>
      <UserDataProvider>
        <BasicAppShell />
      </UserDataProvider>
    </MantineProvider>
  )
}

export function BasicAppShell() {
  return (
    <Container fluid size="xl">
      <Nav />
      <Routes />
    </Container>
  )
}
