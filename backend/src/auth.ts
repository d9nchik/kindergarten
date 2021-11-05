import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RouteHandlerMethod,
} from 'fastify';
import { createHash } from 'crypto';
import db from './db';

interface LoginProps {
  login: string;
  password: string;
}

export interface TokenProps {
  id: number;
  statusArray: string[];
  organizerArray: number[];
}

// const getToken: RouteHandlerMethod = async (req, res) => {
//   const payload = req.body as LoginProps;
// };

const auth: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify,
  _,
  done,
) => {
  fastify.route({
    method: 'POST',
    url: '/secretPath',
    preHandler: fastify.auth([fastify.verifyJWTAndAdminRights]),
    handler: async () => {
      return { message: 'hello' };
    },
  });

  fastify.post<{ Body: LoginProps }>(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            login: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['login', 'password'],
        },
      },
      attachValidation: true,
    },
    async (req, res) => {
      if (req.validationError) {
        res.code(400).send(req.validationError);
        return;
      }
      const payload = req.body;
      const passwordHash = getSHA256(payload.password);
      try {
        const resultID = await db.query(
          'SELECT id FROM kindergarten."user" WHERE email=$1 and password_hash=$2',
          [payload.login, passwordHash],
        );

        if (resultID.rows.length === 0) {
          res.code(400).send('Check your login and password');
          return;
        }

        const id = Number(resultID.rows[0].id);

        const resultStatus = await db.query(
          'SELECT title FROM kindergarten.user_roles JOIN kindergarten.role r on r.id = user_roles.role_id WHERE user_id=$1;',
          [id],
        );

        const statusArray = resultStatus.rows.map((e) => String(e.title));

        const resultOrganizer = await db.query(
          `SELECT eo.id AS organizer_id
                      FROM kindergarten.event_organizer_user eou
                      JOIN kindergarten.event_organizer eo on eo.id = eou.event_organizer_id
                      WHERE user_id = $1;
                      `,
          [id],
        );
        const organizerArray = resultOrganizer.rows.map((e) =>
          Number(e.organizer_id),
        );
        const tokenData = {
          id,
          statusArray,
          organizerArray,
        } as TokenProps;

        const token = fastify.jwt.sign(tokenData);
        return { token };
      } catch (error) {
        console.log(error);
        res.code(500).send({ message: 'Sorry. We are unavailable' });
      }
    },
  );

  done();
};

function getSHA256(pwd: string): string {
  return createHash('sha256').update(pwd).digest('hex');
}

export default auth;
