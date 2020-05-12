import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Link, Route} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import UserPage from './UserPage';
import Login from './Login';
import Register from './Register';
import Upload from './Upload';

function App() {
  return (
    <div className="App">
      <Router>
        <header>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/logout">Logout</Link>
          <Link to="/upload">Upload</Link>
        </header>
        <Route exact path="/">
          <UserPage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/upload">
          <Upload />
        </Route>
      </Router>
    </div>
  );
}

export default App;
