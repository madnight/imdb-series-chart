import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import App from './app';
import About from './components/About';
import Sample from './components/Sample';

const Routes = () => (
  <Router>
    <div>
      <Route path="/" component={App}/>
    </div>
  </Router>
);

export default Routes;
