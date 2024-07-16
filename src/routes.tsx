import { Route, Router, Switch } from "wouter";

import { Custom404 } from "./components/404";
import { Home } from "./components/home";

export function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />

        <Route>
          <Custom404 />
        </Route>
      </Switch>
    </Router>
  );
}
