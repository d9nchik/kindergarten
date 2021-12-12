import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RouteHandlerMethod,
} from 'fastify';
import db from './db';

const serverErrorMessage = 'Sorry, something gone wrong';

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

const futureEvents: RouteHandlerMethod = async (req, res) => {
  const payload = req.query as { userID: number; subString: string };
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
      [payload.userID, payload.subString ? `%${payload.subString}%` : '%'],
    );
    const notSelectedEvents = result.rows.map(rowToEvent);
    res.send(notSelectedEvents);
  } catch (err) {
    console.log(err);
    res.code(500).send(serverErrorMessage);
  }
};
const bookedEvents: RouteHandlerMethod = async (req, res) => {
  const payload = req.query as { userID: number };
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
      [payload.userID],
    );
    const notSelectedEvents = result.rows.map(rowToEvent);
    res.send(notSelectedEvents);
  } catch (err) {
    res.code(500).send(serverErrorMessage);
  }
};

const bookEvent: RouteHandlerMethod = async (req, res) => {
  if (req.validationError) {
    res.code(400).send(req.validationError);
    return;
  }
  const payload = req.query as { userID: number; eventID: number };
  try {
    await db.query(
      `INSERT INTO kindergarten.book (event_id, user_id, book_status_id)
        VALUES ($1, $2, 1);`,
      [payload.eventID, payload.userID],
    );
    res.send('Successfully booked');
  } catch (err) {
    console.log(err);
    res.code(500).send(serverErrorMessage);
  }
};

const user: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify,
  _,
  done,
) => {
  fastify.route({
    method: 'GET',
    url: '/futureEvents',
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: futureEvents,
  });

  fastify.route({
    method: 'GET',
    url: '/bookedEvents',
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: bookedEvents,
  });

  fastify.route({
    method: 'GET',
    url: '/bookEvent',
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: bookEvent,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          eventID: { type: 'number' },
        },
        required: ['eventID'],
      },
    },
    attachValidation: true,
  });

  done();
};

export default user;
