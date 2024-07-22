import { useDocumentTitle } from "@mantine/hooks";

import { SignedIn } from "../signed-in";
import { Pageviews } from "./pageviews";

export default function Charts() {
  useDocumentTitle("Charts");

  return (
    <SignedIn>
      <Pageviews />
    </SignedIn>
  );
}
