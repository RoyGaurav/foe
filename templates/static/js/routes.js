import React from 'react';
import { HashRouter, Route, hashHistory, Switch } from 'react-router-dom';
import FightLogs from './components/FightLogs';
import MemberList from './components/MemberList';
import GreatBuildings from './components/GreatBuildings';
import MemberDetails from './components/MemberDetails';
import Notfound from './components/NotFound';
// import more components
export default (
    <HashRouter history={hashHistory}>
        <div>
            <Switch>
                <Route exact path='/' component={FightLogs} />
                <Route path='/noah-guild-members-list' component={MemberList} />
                <Route path='/noah-guild-great-buildings' component={GreatBuildings} />
                <Route path='/noah-member-details/:id' component={MemberDetails} />
                <Route component={Notfound} />
            </Switch>
        </div>
    </HashRouter>
);