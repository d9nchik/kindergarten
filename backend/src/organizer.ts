import db from './db';

export const getEventsType = async () => {
  try {
    const result = await db.query(
      'SELECT id, name FROM kindergarten.event_type',
    );
    return result.rows.map((e) => ({
      id: Number(e.id),
      name: e.name,
    }));
  } catch (error) {
    return [];
  }
};

interface AddEventProps {
  eventTypeID: number;
  userOrganizerID: number;
  name: string;
  date: number;
  startTime: string;
  endTime: string | null;
  price: number;
  minParticipantsCount: number;
  detailedInfo: string | null;
}

export const addEvent = async (event: AddEventProps) => {
  try {
    await db.query(
      `INSERT INTO kindergarten.event (event_type_id, event_organizer_id, name, date, start_time, end_time, price,
                                min_participants_count, detailed_info)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [
        event.eventTypeID,
        event.userOrganizerID,
        event.name,
        new Date(event.date),
        event.startTime,
        event.endTime,
        event.price,
        event.minParticipantsCount,
        event.detailedInfo,
      ],
    );
    return event;
  } catch (error) {
    console.log(error);
    return null;
  }
};
