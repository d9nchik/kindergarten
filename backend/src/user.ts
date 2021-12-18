import db from './db';

interface RowEventProps {
  name: string;
  id: number;
  price: number;
  date: Date;
  start_time: string;
  end_time: string | null;
  min_participants_count: number;
  detailed_info: string | null;
  user_joined: string;
}
interface EventProps {
  name: string;
  id: number;
  price: number;
  date: Date;
  start_time: string;
  end_time: string | null;
  min_participants_count: number;
  detailed_info: string | null;
  user_joined: number;
}

const rowToEvent = (row: RowEventProps): EventProps => ({
  name: row.name,
  id: row.id,
  price: row.price,
  date: row.date,
  start_time: row.start_time,
  end_time: row.end_time,
  min_participants_count: row.min_participants_count,
  detailed_info: row.detailed_info,
  user_joined: Number(row.user_joined),
});

export const futureEvents = async (
  userID: number,
  subString: string,
): Promise<EventProps[]> => {
  try {
    const result = await db.query(
      `SELECT name,
              price,
              T.id AS id,
              date,
              start_time,
              end_time,
              min_participants_count,
              detailed_info,
              user_joined
        FROM (
                SELECT id, COUNT(user_id) AS user_joined
                FROM kindergarten.event
                          LEFT JOIN kindergarten.book b on event.id = b.event_id
                WHERE is_selected = TRUE
                  AND (date + start_time) > NOW()
                  AND id NOT IN (SELECT book.event_id FROM kindergarten.book WHERE book.user_id = $1)
                GROUP BY id) T
                JOIN kindergarten.event e ON T.id = e.id
        WHERE name LIKE $2 LIMIT 100;`,
      [userID, subString ? `%${subString}%` : '%'],
    );
    return result.rows.map(rowToEvent);
  } catch (err) {
    console.log(err);
    return [];
  }
};
export const bookedEvents = async (userID: string): Promise<EventProps[]> => {
  try {
    const result = await db.query(
      `SELECT T.id,
                name,
                price,
                date,
                start_time,
                end_time,
                min_participants_count,
                detailed_info,
                user_joined
          FROM (
                  SELECT id, COUNT(user_id) AS user_joined
                  FROM kindergarten.event
                            LEFT JOIN kindergarten.book b on event.id = b.event_id
                  WHERE is_selected = TRUE
                    AND (date + start_time) > NOW()
                    AND b.event_id IN (SELECT b.event_id FROM kindergarten.book b WHERE b.user_id=$1)
                    AND b.book_status_id = 1
                  GROUP BY id) T
                  JOIN kindergarten.event e ON T.id = e.id;`,
      [userID],
    );
    return result.rows.map(rowToEvent);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const bookEvent = async (eventID: string, userID: string) => {
  try {
    await db.query(
      `INSERT INTO kindergarten.book (event_id, user_id, book_status_id)
        VALUES ($1, $2, 1);`,
      [eventID, userID],
    );
    console.log('Successfully booked');
  } catch (err) {
    console.log(err);
  }
};
export const getEventByID = async (
  eventID: string,
): Promise<EventProps | null> => {
  try {
    const result = await db.query(
      `SELECT T.id,
                name,
                price,
                date,
                start_time,
                end_time,
                min_participants_count,
                detailed_info,
                user_joined
          FROM (
                  SELECT id, COUNT(user_id) AS user_joined
                  FROM kindergarten.event
                            LEFT JOIN kindergarten.book b on event.id = b.event_id
                  WHERE is_selected = TRUE
                    AND id = $1
                  GROUP BY id) T
                  JOIN kindergarten.event e ON T.id = e.id;`,
      [eventID],
    );
    return rowToEvent(result.rows[0]);
  } catch (err) {
    console.error(err);
    return null;
  }
};
