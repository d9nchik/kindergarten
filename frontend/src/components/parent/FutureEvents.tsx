import React, { FunctionComponent, useEffect, useState } from 'react';
import Parent, { Event } from '../../utils/parent';

interface IProps {
  parent: Parent;
}

const FutureEvents: FunctionComponent<IProps> = ({ parent }: IProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchName, setSearchName] = useState('');
  const [sponsorEvents, setSponsorEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => setEvents(await parent.getFutureEvents()))();
  }, [parent]);
  useEffect(() => {
    (async () => setSponsorEvents(await parent.getSponsorEvents('')))();
  }, [parent]);

  useEffect(() => {
    (async () => setEvents(await parent.getFutureEvents(searchName)))();
    (async () => setSponsorEvents(await parent.getSponsorEvents(searchName)))();
  }, [searchName, parent]);

  return (
    <div>
      <h2>Future Events</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Event Name:
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </label>
        <br />
        <button
          onClick={() => {
            setSearchName('');
          }}
        >
          Clear
        </button>
      </form>
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
              <button
                onClick={async () => {
                  try {
                    if (await parent.bookEvent(id)) {
                      setEvents(
                        events.filter(({ id: filterId }) => filterId !== id),
                      );
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Add "{name}" to Booked Events
              </button>
            </li>
          ),
        )}
      </ul>
      <h3>Sponsored events:</h3>
      <ul>
        {sponsorEvents.map(
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

export default FutureEvents;
