import React, { FunctionComponent } from 'react';
import { user } from '../utils/facade';
import { useNavigate } from 'react-router-dom';

const Logout: FunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          user.logout();
          navigate('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
