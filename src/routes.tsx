import { lazy, Suspense } from "react"
import { Route, Router, Switch } from "wouter"

import { Custom404 } from "./components/404"
import { Home } from "./components/home"

type LazyComponentT = React.LazyExoticComponent<() => JSX.Element>

function LC(Component: LazyComponentT, loadingText = "Loading") {
  return () => {
    return (
      <Suspense fallback={<p>{loadingText}</p>}>
        <Component />
      </Suspense>
    )
  }
}

const Charts = LC(lazy(() => import("./components/charts")))
const Query = LC(lazy(() => import("./components/query")))

export function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/query" component={Query} />
        <Route path="/charts" component={Charts} />

        <Route>
          <Custom404 />
        </Route>
      </Switch>
    </Router>
  )
}
