import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Main from './Main'
import Main2 from './Main2'
import 'normalize.css/normalize.css'
import 'csshake/dist/csshake-default.min.css'
import 'csshake/dist/csshake-horizontal.min.css'
import './less/main.less'

const rootEl = document.getElementById('main')

function render() {
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Main}/>
            </Route>
            <Route path="/index.jsp" component={Main}>
                <IndexRoute component={Main}/>
            </Route>
            <Route path="/index2.jsp" component={Main2}>
                <IndexRoute component={Main2}/>
            </Route>
        </Router>,
        rootEl);
}

render()