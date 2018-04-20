import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import App from './app';

const Routes = () => (
  <Router>
    <div>
      <Route path="/" component={App}/>
    </div>
  </Router>
);

export default Routes;
