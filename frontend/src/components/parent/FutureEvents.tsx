import React, { FunctionComponent, useEffect, useState } from 'react';
import Parent, { Event } from '../../utils/parent';
import {
  AndSpecification,
  MaxPriceSpecification,
  NameSpecification,
} from '../../utils/specification';

interface IProps {
  parent: Parent;
}

const FutureEvents: FunctionComponent<IProps> = ({ parent }: IProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchName, setSearchName] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => setEvents(await parent.getFutureEvents()))();
  }, [parent]);
  useEffect(() => {
    const maxPriceSpecification = new MaxPriceSpecification(
      maxPrice ? Number(maxPrice) : undefined,
    );
    const searchNameSpecification = new NameSpecification(searchName);
    const maxPriceAndSearchNameSpecification = new AndSpecification();
    maxPriceAndSearchNameSpecification.addSpecification(maxPriceSpecification);
    maxPriceAndSearchNameSpecification.addSpecification(
      searchNameSpecification,
    );
    setFilteredEvents(
      events.filter((event) =>
        maxPriceAndSearchNameSpecification.isSatisfiedByEvent(event),
      ),
    );
  }, [events, searchName, maxPrice]);

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
        <label>
          Max Price
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            setSearchName('');
            setMaxPrice('');
          }}
        >
          Clear
        </button>
      </form>
      <ul>
        {filteredEvents.map(
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
    </div>
  );
};

export default FutureEvents;
