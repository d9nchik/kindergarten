import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RouteHandlerMethod,
} from 'fastify';
import db from './db';

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
    res.code(500).send('Something gone wrong');
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
    res.code(500).send('Something gone wrong');
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
    res.code(500).send('Something gone wrong');
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

  done();
};

export default manager;
