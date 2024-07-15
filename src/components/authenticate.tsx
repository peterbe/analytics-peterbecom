import { Alert, Container, Paper } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

import { useUserData } from "../contexts/user-context";

export function Authenticate() {
  useDocumentTitle("Sign in");
  const { userData } = useUserData();

  return (
    <Container size={420} my={40}>
      {userData && userData.user && (
        <Alert>
          You&apos;re already signed in! <b>{userData.user.username}</b>
        </Alert>
      )}

      <SignIn />
    </Container>
  );
}

function SignIn() {
  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      SIGN IN
    </Paper>
  );
}
