import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import { user } from '../../utils/facade';
import BookedEvents from './BookedEvents';
import FutureEvents from './FutureEvents';

const Parent: FunctionComponent = () => {
  const parent = user.getParent();

  if (!parent) {
    return <div>Parent instance is null</div>;
  }

  return (
    <div>
      <Link to="futureEvents">Future Events</Link>
      <Link to="bookedEvents">Booked Events</Link>
      <Routes>
        <Route path="futureEvents" element={<FutureEvents parent={parent} />} />
        <Route path="bookedEvents" element={<BookedEvents parent={parent} />} />
      </Routes>
    </div>
  );
};

export default Parent;
