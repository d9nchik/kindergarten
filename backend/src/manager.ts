import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RouteHandlerMethod,
} from 'fastify';
import db from './db';

const serverHaveCrashedMessage = 'Something gone wrong';

const getAllOrganizers: RouteHandlerMethod = async (req, res) => {
  try {
    const response = await db.query(
      'SELECT id, name FROM kindergarten.event_organizer',
    );
    const organizerArray = response.rows.map((e) => ({
      id: Number(e.id),
      companyName: String(e.name),
    }));
    res.send(organizerArray);
  } catch (error) {
    res.code(500).send(serverHaveCrashedMessage);
  }
};

interface GetOrganizerProps {
  organizerID: number;
}

interface OrganizerInformation {
  organizerID: number;
  name: string;
  address: string;
  phone_number: string;
  site: string | null;
  mail: string;
  detailed_info: string | null;
}

const getOrganizer: RouteHandlerMethod = async (req, res) => {
  if (req.validationError) {
    res.code(400).send(req.validationError);
    return;
  }
  const payload = req.query as GetOrganizerProps;
  try {
    const response = await db.query(
      `SELECT name, address, phone_number, site, mail, detailed_info
         FROM kindergarten.event_organizer WHERE id=$1;`,
      [payload.organizerID],
    );

    if (response.rows.length === 0) {
      res.code(404).send('Organizer not found!');
      return;
    }
    const currentRow = response.rows[0];
    const organizerObj: OrganizerInformation = {
      organizerID: payload.organizerID,
      name: currentRow.name,
      address: currentRow.address,
      phone_number: currentRow.phone_number,
      site: currentRow.site,
      mail: currentRow.mail,
      detailed_info: currentRow.detailed_info,
    };
    res.send(organizerObj);
  } catch (error) {
    res.code(500).send(serverHaveCrashedMessage);
  }
};

const updateOrganizer: RouteHandlerMethod = async (req, res) => {
  if (req.validationError) {
    res.code(400).send(req.validationError);
    return;
  }
  const payload = req.body as OrganizerInformation;
  try {
    await db.query(
      `UPDATE kindergarten.event_organizer
        SET name=$1,
            address=$2,
            phone_number=$3,
            site=$4,
            mail=$5,
            detailed_info=$6
        WHERE id = $7;`,
      [
        payload.name,
        payload.address,
        payload.phone_number,
        payload.site,
        payload.mail,
        payload.detailed_info,
        payload.organizerID,
      ],
    );
    res.send('Update successfully');
  } catch (error) {
    res.code(500).send(serverHaveCrashedMessage);
  }
};

const getNotSelectedEvents: RouteHandlerMethod = async (req, res) => {
  try {
    const result = await db.query(`SELECT id,
                                        name,
                                        price,
                                        date,
                                        start_time,
                                        end_time,
                                        min_participants_count,
                                        detailed_info
                                  FROM kindergarten.event
                                  WHERE is_selected = FALSE
                                    AND (date + start_time) > NOW() + '3d';`);
    const notSelectedEvents = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      date: row.date,
      start_time: row.start_time,
      end_time: row.end_time,
      min_participants_count: row.min_participants_count,
      detailed_info: row.detailed_info,
    }));
    res.send(notSelectedEvents);
  } catch (err) {
    res.code(500).send(serverHaveCrashedMessage);
  }
};

const selectEvent: RouteHandlerMethod = async (req, res) => {
  const payload = req.query as { eventID: number };
  try {
    await db.query(
      `UPDATE kindergarten.event
        SET is_selected= TRUE
        WHERE id = $1;`,
      [payload.eventID],
    );
    res.send('Selected event successfully');
  } catch (err) {
    res.code(500).send(serverHaveCrashedMessage);
  }
};

const futureEvents: RouteHandlerMethod = async (req, res) => {
  try {
    const result = await db.query(`SELECT name,
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
                                            GROUP BY id) T
                                            JOIN kindergarten.event e ON T.id = e.id;`);
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
    res.code(500).send(serverHaveCrashedMessage);
  }
};

const manager: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify,
  _,
  done,
) => {
  fastify.route({
    method: 'GET',
    url: '/allOrganizers',
    preHandler: fastify.auth([fastify.verifyJWTAndAdminRights]),
    handler: getAllOrganizers,
  });
  fastify.route({
    method: 'GET',
    url: '/organizer',
    preHandler: fastify.auth([fastify.verifyJWTAndAdminRights]),
    handler: getOrganizer,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          organizerID: { type: 'number' },
        },
        required: ['organizerID'],
      },
    },
    attachValidation: true,
  });
  fastify.route({
    method: 'POST',
    url: '/updateOrganizer',
    preHandler: fastify.auth([fastify.verifyJWTAndAdminRights]),
    handler: updateOrganizer,
    schema: {
      body: {
        type: 'object',
        properties: {
          organizerID: { type: 'number' },
          name: { type: 'string' },
          address: { type: 'string' },
          phone_number: { type: 'string' },
          site: { type: 'string' },
          mail: { type: 'string' },
          detailed_info: { type: 'string' },
        },
        required: ['organizerID', 'name', 'address', 'phone_number', 'mail'],
      },
    },
    attachValidation: true,
  });
  fastify.route({
    method: 'GET',
    url: '/notSelectedEvents',
    preHandler: fastify.auth([fastify.verifyJWTAndAdminRights]),
    handler: getNotSelectedEvents,
  });
  fastify.route({
    method: 'GET',
    url: '/selectEvent',
    preHandler: fastify.auth([fastify.verifyJWTAndAdminRights]),
    handler: selectEvent,
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
  fastify.route({
    method: 'GET',
    url: '/futureEvents',
    preHandler: fastify.auth([fastify.verifyJWTAndAdminRights]),
    handler: futureEvents,
  });

  done();
};
export default manager;
