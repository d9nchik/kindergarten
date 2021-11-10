import React, { FunctionComponent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { user } from '../utils/facade';

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  return (
    <div>
      {user.isAuthenticated() && <Navigate to={{ pathname: '/' }} />}
      <h2>Login Page</h2>
      <h3>{message}</h3>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await user.login(email, password);
          if (user.isAuthenticated()) {
            navigate('/');
          } else {
            setMessage('Check your login and Password');
          }
        }}
      >
        <label>
          E-mail
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <input id={'buttonLogIn'} type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
