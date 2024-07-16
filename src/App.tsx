// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "./styles/globals.css";

import { MantineProvider } from "@mantine/core";
import { Container, Text } from "@mantine/core";

// import { useDisclosure } from "@mantine/hooks";
// import { MantineLogo } from "@mantinex/mantine-logo";
// import { FooterSimple } from "./components/foot";
// import { HeaderTabs } from "./components/head";
// import ScrollToTop from "./components/scroll-to-top";
import { UserDataProvider, useUserData } from "./contexts/user-context";
// import { useMyTheme } from "./hooks/theme";
import { Routes } from "./routes";

export default function App() {
  // const { myTheme } = useMyTheme();
  return (
    <MantineProvider defaultColorScheme={"light"}>
      {/* <Notifications /> */}
      <UserDataProvider>
        <BasicAppShell />
        {/* <ScrollToTop /> */}
        {/* <AppShellCounter>
          <Routes />
        </AppShellCounter> */}
        {/* <FooterSimple /> */}
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
