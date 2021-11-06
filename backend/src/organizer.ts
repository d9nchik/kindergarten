import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RouteHandlerMethod,
} from 'fastify';
import db from './db';

const getEventsType: RouteHandlerMethod = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name FROM kindergarten.event_type',
    );
    const eventTypeArray = result.rows.map((e) => ({
      id: Number(e.id),
      name: e.name,
    }));
    res.send(eventTypeArray);
  } catch (error) {
    res.code(500).send('Something gone wrong');
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

const addEvent: RouteHandlerMethod = async (req, res) => {
  if (req.validationError) {
    res.code(400).send(req.validationError);
    return;
  }
  const payload = req.body as AddEventProps;
  try {
    await db.query(
      `INSERT INTO kindergarten.event (event_type_id, event_organizer_id, name, date, start_time, end_time, price,
                                min_participants_count, detailed_info)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [
        payload.eventTypeID,
        payload.userOrganizerID,
        payload.name,
        new Date(payload.date),
        payload.startTime,
        payload.endTime,
        payload.price,
        payload.minParticipantsCount,
        payload.detailedInfo,
      ],
    );
    res.send('Inserted successfully');
  } catch (error) {
    console.log(error);
    res.code(500).send('Something gone wrong');
  }
};

const organizer: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify,
  _,
  done,
) => {
  fastify.route({
    method: 'POST',
    url: '/addEvent',
    preHandler: fastify.auth([fastify.verifyJWTAndOrganizerRights]),
    handler: addEvent,
    schema: {
      body: {
        type: 'object',
        properties: {
          eventTypeID: { type: 'number' },
          name: { type: 'string' },
          date: { type: 'number' },
          startTime: { type: 'string' },
          endTime: { type: 'string' },
          price: { type: 'number' },
          minParticipantsCount: { type: 'number' },
          detailedInfo: { type: 'string' },
        },
        required: [
          'eventTypeID',
          'name',
          'date',
          'startTime',
          'price',
          'minParticipantsCount',
        ],
      },
    },
    attachValidation: true,
  });

  fastify.route({
    method: 'GET',
    url: '/eventTypes',
    preHandler: fastify.auth([
      fastify.verifyJWTAndAdminRights,
      fastify.verifyJWTAndOrganizerRights,
    ]),
    handler: getEventsType,
  });

  done();
};

export default organizer;
