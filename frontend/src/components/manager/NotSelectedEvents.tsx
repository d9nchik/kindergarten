import React, { FunctionComponent, useEffect, useState } from 'react';
import Manager, { EventProps } from '../../utils/manager';

interface IProps {
  user: Manager;
}
const NotSelectedEvents: FunctionComponent<IProps> = ({ user }: IProps) => {
  const [events, setEvents] = useState<EventProps[]>([]);

  useEffect(() => {
    (async () => setEvents(await user.getNotSelectedEvents()))();
  }, [user]);

  return (
    <div>
      <ul>
        {events.map(({ id, name, date, start_time, price }) => (
          <li key={id}>
            {`Name: ${name}; Date: ${new Date(
              date,
            ).toLocaleDateString()} Time: ${start_time}; Price: ${price}$`}
            <button
              onClick={async () => {
                try {
                  if (await user.addEventToFutureEvents(id)) {
                    setEvents(
                      events.filter(({ id: filterId }) => filterId !== id),
                    );
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Add "{name}" to Future Events
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotSelectedEvents;
