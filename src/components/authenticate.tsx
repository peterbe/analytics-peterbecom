import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  List,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useDocumentTitle, useLocalStorage } from "@mantine/hooks";
// import { showNotification } from "@mantine/notifications";
// import { useEffect, useState } from "react";
// import { mutate } from "swr";
// import { ArrowLeft } from "tabler-icons-react";

import { useUserData } from "../contexts/user-context";
// import { LoadingError } from "./loading-error";
// import { PageTitle } from "./page-title";
// import { JSONPost } from "./poster";
// import { getCookie } from "./utils";

// const REMEMBERED_EMAIL_KEY = "remembered-email";

// type AuthError = {
//   [key: string]: string[];
// };

export function Authenticate() {
  useDocumentTitle("Sign in");
  // const [forgottenPassword, setForgottenPassword] = useState(false)
  const { userData } = useUserData();

  return (
    <Container size={420} my={40}>
      {/* <PageTitle title={forgottenPassword ? "Forgotten password" : "Sign in"} /> */}

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
// function SignIn({
//   toggleForgottenPassword,
// }: {
//   toggleForgottenPassword: () => void;
// }) {
//   const [defaultEmail, setDefaultEmail] = useLocalStorage({
//     key: REMEMBERED_EMAIL_KEY,
//     defaultValue: "",
//   });
//   const [email, setEmail] = useState(defaultEmail);

//   useEffect(() => {
//     if (!email && defaultEmail) {
//       setEmail(defaultEmail);
//     }
//   }, [email, defaultEmail]);

//   const [loading, setLoading] = useState(false);
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(true);
//   const [waiting, setWaiting] = useState(false);

//   const [authError, setAuthError] = useState<AuthError | null>(null);
//   const [signInError, setSignInError] = useState<Error | null>(null);

//   const { userData } = useUserData();

//   useDocumentTitle("Sign in");

//   async function signIn() {
//     if (!userData) return;

//     const csrftoken = getCookie("csrftoken");
//     if (!csrftoken) {
//       showNotification({
//         title: "Authentication problem",
//         color: "red",
//         message: "You don't have a cookie yet. Refresh the page?",
//         autoClose: 10 * 1000,
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await JSONPost(
//         "/api/signin",
//         {
//           email,
//           password,
//           remember_me: rememberMe,
//         },
//         csrftoken
//       );

//       setDefaultEmail(email);

//       if (res.ok) {
//         showNotification({
//           title: "Authentication success",
//           color: "green",
//           message: "Let's do this!",
//         });
//         mutate("/api/whoami");
//         setWaiting(true);
//       } else if (res.status === 400) {
//         const data = await res.json();
//         const errors = data.errors as AuthError;
//         let errorMessage = "";
//         Object.entries(errors).forEach(
//           ([key, value]) => (errorMessage += `${key}: ${value}\n`)
//         );
//         setAuthError(errors);
//         showNotification({
//           title: "Authentication failure",
//           color: "red",
//           message: errorMessage,
//           autoClose: 10 * 1000,
//         });
//       } else {
//         showNotification({
//           title: "Authentication Error",
//           color: "red",
//           message: `Error happened when trying to authenticate (${res.status} - ${res.statusText})`,
//           autoClose: false,
//         });
//         throw new Error(`${res.status} - ${res.statusText}`);
//       }
//     } catch (err) {
//       if (err instanceof Error) {
//         setSignInError(err);
//       } else {
//         throw err;
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Paper withBorder shadow="md" p={30} mt={30} radius="md">
//       <LoadingOverlay visible={loading || !userData || waiting} />

//       {signInError && <LoadingError error={signInError} />}

//       {authError && (
//         <Alert title="Authentication error" color="red">
//           <List>
//             {Object.entries(authError).map(([key, errors]) => {
//               return errors.map((err) => (
//                 <List.Item key={key + err}>
//                   {err}
//                   {/* <small>({key})</small> */}
//                 </List.Item>
//               ));
//             })}
//           </List>
//         </Alert>
//       )}
//       <form
//         onSubmit={(event) => {
//           event.preventDefault();
//           if (email.trim() && password.trim()) {
//             signIn();
//           }
//         }}
//       >
//         <TextInput
//           type="email"
//           label="Email"
//           id="id_email"
//           autoComplete="email"
//           placeholder="Your email here"
//           required
//           value={email}
//           onChange={(event) => {
//             setEmail(event.target.value);
//           }}
//           error={authError && authError.email && authError.email.join("\n")}
//           onBlur={() => {
//             if (!defaultEmail && email.trim()) {
//               setDefaultEmail(email.trim());
//             }
//           }}
//         />
//         <PasswordInput
//           label="Password"
//           autoComplete="current-password"
//           placeholder="Your password"
//           id="id_password"
//           required
//           mt="md"
//           onChange={(event) => {
//             setPassword(event.target.value);
//           }}
//           error={
//             authError && authError.password && authError.password.join("\n")
//           }
//         />
//         <Group justify="space-between" mt="md">
//           <Checkbox
//             label="Remember me"
//             checked={rememberMe}
//             onChange={() => {
//               setRememberMe((prevState) => !prevState);
//             }}
//           />

//           <Anchor<"a">
//             href="#forgotten-password"
//             size="sm"
//             onClick={() => {
//               toggleForgottenPassword();
//             }}
//           >
//             Forgot password?
//           </Anchor>
//         </Group>

//         {/* Do NOT make this disabled until the password is filled
//             because a browser password manager might have filled it
//             in without you knowing in React.
//          */}
//         <Button type="submit" fullWidth mt="xl">
//           Sign in
//         </Button>
//       </form>
//     </Paper>
//   );
// }
