import { Route, Router, Switch } from "wouter";

import { Custom404 } from "./components/404";
import { Home } from "./components/home";
// import { Listings } from "./components/listings"
// import { NewContact } from "./components/new-contact"
// import { Members } from "./components/organization/members"
// import { Properties } from "./components/properties"
// import { SignOut } from "./components/signout"

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
