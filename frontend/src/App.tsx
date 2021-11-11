import React from 'react';
import './App.css';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRouter from './components/Authenticated';
import RoleSwitcher from './components/RoleSwitcher';
import Logout from './components/Logout';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AuthenticatedRouter />}>
            <Route
              path="/*"
              element={
                <div>
                  <Logout />
                  <RoleSwitcher />
                </div>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
