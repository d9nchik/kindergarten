import React, { FunctionComponent } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AllOrganizers from './AllOrganizers';
import ChangeOrganizer from './ChangeOrganizer';
import { user } from '../../utils/facade';
import NotSelectedEvents from './NotSelectedEvents';

const Manager: FunctionComponent = () => {
  const manager = user.getManager();
  if (!manager) {
    return <div>Problem with manager account!</div>;
  }

  return (
    <div>
      <Link to="allOrganizers">All organizers</Link>
      <Link to="notSelectedEvents">New Events</Link>
      <Routes>
        <Route
          path="/allOrganizers"
          element={<AllOrganizers user={manager} />}
        />
        <Route
          path="/changeOrganizer/:id"
          element={<ChangeOrganizer user={manager} />}
        />
        <Route
          path="/notSelectedEvents"
          element={<NotSelectedEvents user={manager} />}
        />
      </Routes>
    </div>
  );
};

export default Manager;
