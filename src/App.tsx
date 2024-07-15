// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
// import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
// import "@mantine/charts/styles.css";
import "./styles/globals.css";

import { AppShell, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
// import type { ReactNode } from "react";
import { Burger, Group, Container, Text } from "@mantine/core";
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
      <Notifications />
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

// function AppShellCounter({ children }: { children: ReactNode }) {
//   const { userData } = useUserData();
//   return (
//     <AppShell padding="md" header={{ height: 105 }}>
//       {userData && userData.user && (
//         <AppShell.Header>
//           <HeaderTabs user={userData.user} />
//         </AppShell.Header>
//       )}
//       <AppShell.Main>{children}</AppShell.Main>
//     </AppShell>
//   );
// }

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
  // const { userData } = useUserData();
  // const [opened, { toggle }] = useDisclosure();

  // return (
  //   <AppShell
  //     header={{ height: 60 }}
  //     navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
  //     padding="md"
  //   >
  //     <AppShell.Header>
  //       <Group h="100%" px="md">
  //         <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
  //         {/* <MantineLogo size={30} /> */}
  //         {userData?.user ? userData?.user.username : "Anonymous"}
  //       </Group>
  //     </AppShell.Header>
  //     <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
  //     <AppShell.Main>
  //       <Routes />
  //     </AppShell.Main>
  //   </AppShell>
  // );
}
