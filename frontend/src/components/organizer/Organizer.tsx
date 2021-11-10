import React, { FunctionComponent, useEffect, useState } from 'react';
import { user } from '../../utils/facade';
import { EventType } from '../../utils/organizer';

const Organizer: FunctionComponent = () => {
  const organizer = user.getOrganizer();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState(0);
  const [minParticipantsCount, setMinParticipantsCount] = useState(1);
  const [detailedInfo, setDetailedInfo] = useState('');
  const [eventType, setEventType] = useState(1);

  useEffect(() => {
    if (organizer) {
      (async () => {
        setEventTypes(await organizer.getEventsTypes());
      })();
    }
  }, [organizer]);

  if (!organizer) {
    return <div>Oops organizer is null!</div>;
  }
  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await organizer.addEvent({
              eventTypeID: eventType,
              name: eventName,
              date: new Date(date).getTime(),
              startTime,
              endTime: endTime !== '' ? endTime : undefined,
              price,
              minParticipantsCount,
              detailedInfo: detailedInfo !== '' ? detailedInfo : undefined,
            });
            setEventType(1);
            setEventName('');
            setDate('');
            setStartTime('');
            setEndTime('');
            setPrice(0);
            setMinParticipantsCount(1);
            setDetailedInfo('');
          } catch (er) {
            console.log(er);
          }
        }}
      >
        <label>
          Event Type:
          <select
            required
            name="eventType"
            value={eventType}
            onChange={(event) => setEventType(Number(event.target.value))}
          >
            {eventTypes.map(({ id, name }) => (
              <option value={id} key={`${id}${name}`}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Event name:
          <input
            required
            type="text"
            name="eventName"
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
          />
        </label>
        <br />
        <label>
          Date
          <input
            required
            type="date"
            name="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <br />
        <label>
          Start time
          <input
            required
            type="time"
            name="startTime"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
        </label>
        <br />
        <label>
          End time:
          <input
            type="time"
            name="endTime"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          />
        </label>
        <br />
        <label>
          Price:
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
          />
        </label>
        <br />
        <label>
          Min number of participants:
          <input
            required
            type="number"
            min="1"
            step="1"
            value={minParticipantsCount}
            onChange={(event) =>
              setMinParticipantsCount(Number(event.target.value))
            }
          />
        </label>
        <br />
        <label>
          Detail Info:
          <textarea
            name="detailedInfo"
            value={detailedInfo}
            onChange={(event) => setDetailedInfo(event.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
};

export default Organizer;
