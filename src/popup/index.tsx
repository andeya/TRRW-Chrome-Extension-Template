import React, { Fragment } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Hello from './pages/hello';
// import '@/content'

function Popup() {
  return (
    <Fragment>
      <HashRouter>
        <Switch>
          <Route path="/hello" component={Hello} />
          <Route path="/" component={Hello} />
          <Redirect to={'/login'} />
        </Switch>
      </HashRouter>
    </Fragment>
  );
}

export default Popup;
