import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Link, Route} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import HomePage from './HomePage';
import UserPage from './UserPage';
import Login from './Login';
import Register from './Register';
import Upload from './Upload';
import UsersPage from './UsersPage';

function App() {
  return (
    <div className="App">
      <Router>
        <header>
          <h1>Fruit Pics</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <a href="/api/logout">Logout</a>
            <Link to="/upload">Upload</Link>
            <Link to="/users">Users</Link>
          </nav>
        </header>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/users/:id" component={UserPage} />
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route exact path="/users">
          <UsersPage />
        </Route>
      </Router>
    </div>
  );
}

export default App;
