import { Alert, Button, LoadingOverlay } from "@mantine/core"
import type { ReactNode } from "react"

import { useUserData } from "../contexts/user-context"
import { Authenticate } from "./authenticate"

export function SignedIn({ children }: { children: ReactNode }) {
  // const { push, asPath } = useRouter()
  // const [location, setLocation] = useLocation()
  const { userData, userError } = useUserData()

  // const isNotSignedIn = userData && !userData.user
  // useEffect(() => {
  //   // console.warn("NOT SIGNED IN, NEEDS TO REDIRECT")
  //   if (isNotSignedIn && !location.startsWith("/signin")) {
  //     setLocation(`/signin?${new URLSearchParams({ cf: location })}`)
  //   }
  // }, [isNotSignedIn, location, setLocation])
  //
  // if (!isNotSignedIn && userData !== null) {
  //   let redirectTo = "/signin"
  //   redirectTo += `?${new URLSearchParams({ cf: location })}`
  //   return <Redirect to={redirectTo} />
  // }

  if (userError) {
    return (
      <div>
        <Alert color="red" title="Network error">
          <p>Something went wrong with your authentication.</p>
          <p>
            <b>Error:</b> <code>{userError.toString()}</code>
          </p>
          <Button
            variant="outline"
            color="red"
            onClick={() => {
              window.location.reload()
            }}
          >
            Try reloading
          </Button>
        </Alert>
      </div>
    )
  }
  if (!userData) {
    return <LoadingOverlay visible={true} />
  }
  if (!userData.user) {
    return <Authenticate />
    // return null
  }
  return <div>{children}</div>
}
