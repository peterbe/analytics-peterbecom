// import { lazy, Suspense } from "react";
import { Suspense } from "react";
import { Route, Router, Switch } from "wouter";

import { Custom404 } from "./components/404";
// import { Looks } from "./components/account/looks"
// import { Settings } from "./components/account/settings"
// import { Activities } from "./components/activities"
// import { Authenticate } from "./components/authenticate"
// import { Closings } from "./components/closings"
// import { Contacts } from "./components/contacts"
import { Home } from "./components/home";
// import { Listings } from "./components/listings"
// import { NewContact } from "./components/new-contact"
// import { Members } from "./components/organization/members"
// import { Properties } from "./components/properties"
// import { SignOut } from "./components/signout"

type LazyComponentT = React.LazyExoticComponent<() => JSX.Element>;

function LC(Component: LazyComponentT, loadingText = "Loading") {
  return () => {
    return (
      <Suspense fallback={<p>{loadingText}</p>}>
        <Component />
      </Suspense>
    );
  };
}

// Components that are rarely used are lazily loaded
// const Importer = LC(lazy(() => import("./components/importer")))
// const Timeline = LC(lazy(() => import("./components/timeline")))
// const Logo = LC(lazy(() => import("./components/organization/logo")))
// const Avatar = LC(lazy(() => import("./components/account/avatar")))
// const Calendar = LC(lazy(() => import("./components/calendar")))
// const Types = LC(lazy(() => import("./components/organization/types")))
// const Plans = LC(lazy(() => import("./components/plans")))
// const SavedAggregates = LC(lazy(() => import("./components/saved-aggregates")))

export function Routes() {
  return (
    <Router>
      <Switch>
        {/* <Route path="/signin" component={Authenticate} />
        <Route path="/closings" component={Closings} />
        <Route path="/listings" component={Listings} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/contacts/new" component={NewContact} />
        <Route path="/activities" component={Activities} />
        <Route path="/account/settings" component={Settings} />
        <Route path="/account/looks" component={Looks} />
        <Route path="/organization/members" component={Members} />
        <Route path="/organization/types" component={Types} />
        <Route path="/plans" component={Plans} />
        <Route path="/properties" component={Properties} />
        <Route path="/signout" component={SignOut} />
        <Route path="/aggregates" component={SavedAggregates} />

        <Route path="/calendar" component={Calendar} />
        <Route path="/account/avatar" component={Avatar} />
        <Route path="/organization/logo" component={Logo} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/importer" component={Importer} /> */}

        <Route path="/" component={Home} />

        <Route>
          <Custom404 />
        </Route>
      </Switch>
    </Router>
  );
}
