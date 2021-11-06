import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RouteHandlerMethod,
} from 'fastify';
import db from './db';

const userEvents: RouteHandlerMethod = async (req, res) => {
  const payload = req.query as { userID: number };
  try {
    const result = await db.query(
      `SELECT name,
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
                AND id NOT IN (SELECT book.user_id FROM kindergarten.book WHERE book.user_id = $1)
                GROUP BY id) T
                JOIN kindergarten.event e ON T.id = e.id;`,
      [payload.userID],
    );
    const notSelectedEvents = result.rows.map((row) => ({
      name: row.name,
      price: row.price,
      date: row.date,
      start_time: row.start_time,
      end_time: row.end_time,
      min_participants_count: row.min_participants_count,
      detailed_info: row.detailed_info,
      user_joined: Number(row.user_joined),
    }));
    res.send(notSelectedEvents);
  } catch (err) {
    res.code(500).send('Sorry, something gone wrong');
  }
};

const user: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify,
  _,
  done,
) => {
  fastify.route({
    method: 'GET',
    url: '/myEvents',
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: userEvents,
  });
  done();
};

export default user;
