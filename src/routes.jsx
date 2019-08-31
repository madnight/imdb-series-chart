import React from 'react'
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'
import App from './app'
import { StyleRoot } from 'radium'

const Routes = () => (
    <Router>
        <StyleRoot>
            <div>
                <Route path="/" component={App}/>
            </div>
        </StyleRoot>
    </Router>
)

export default Routes
