import React from 'react'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import './App.css';

import Bus from "./Utils/Bus";

import Chat from "./Components/messenger/chat"
import Acceuil from "./Components/Home/home"

window.flash = (title, message, type = "success") => Bus.emit ('flash', ({title, message, type}));

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/message">
                    <Chat />
                </Route>
                <Route path="/">
                    <Acceuil />
                </Route>
            </Switch>
        </Router>
    );
}
export default App;
