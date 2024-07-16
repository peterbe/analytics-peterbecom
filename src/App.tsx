// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "./styles/globals.css";

import { MantineProvider } from "@mantine/core";
import { Container, Text } from "@mantine/core";

import { UserDataProvider, useUserData } from "./contexts/user-context";
import { Routes } from "./routes";

export default function App() {
  return (
    <MantineProvider defaultColorScheme={"light"}>
      <UserDataProvider>
        <BasicAppShell />
      </UserDataProvider>
    </MantineProvider>
  );
}

export function BasicAppShell() {
  const { userData } = useUserData();
  return (
    <Container fluid size="xl">
      <Text ta="right">
        {userData?.user ? userData?.user.username : "Anonymous"}
      </Text>
      <Routes />
    </Container>
  );
}
