import React, { FunctionComponent, useEffect, useState } from 'react';
import Parent, { Event } from '../../utils/parent';

interface IProps {
  parent: Parent;
}

const BookedEvents: FunctionComponent<IProps> = ({ parent }: IProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    (async () => setEvents(await parent.getBookedEvents()))();
  }, [parent]);

  return (
    <div>
      <h2>Booked Events</h2>
      <ul>
        {events.map(
          ({
            id,
            name,
            date,
            start_time,
            price,
            min_participants_count,
            user_joined,
          }) => (
            <li key={id}>
              {`Name: ${name}; Date: ${new Date(
                date,
              ).toLocaleDateString()} Time: ${start_time}; Price: ${price}$; User: ${user_joined}/${min_participants_count}`}
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default BookedEvents;
