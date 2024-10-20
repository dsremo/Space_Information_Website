import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Events from './components/Events';
import ResearchPapers from './components/ResearchPapers';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/events" component={Events} />
                <Route path="/research-papers" component={ResearchPapers} />
            </Switch>
        </Router>
    );
}

export default App;
