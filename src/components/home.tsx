import { useDocumentTitle } from "@mantine/hooks";

import { SignedIn } from "./signed-in";
import { Query } from "./query";

export function Home() {
  useDocumentTitle("Home");

  return (
    <SignedIn>
      <Query />
    </SignedIn>
  );
}
