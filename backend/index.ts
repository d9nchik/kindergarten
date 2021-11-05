import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyAuth from 'fastify-auth';
import fastifyJWT from 'fastify-jwt';
import auth, { TokenProps } from './src/auth';
import manager from './src/manager';
import organizer from './src/organizer';

const server = fastify({ logger: true });

server.register(fastifyJWT, { secret: 'supersecret' });
server.register(fastifyAuth);

server.decorate(
  'verifyJWT',
  function (
    req: FastifyRequest,
    res: FastifyReply,
    done: (err?: Error | undefined) => void,
  ) {
    const payload = req.body as { token: string };
    const data = this.jwt.verify(payload.token);
    console.log(data);
    done();
  },
);

server.decorate(
  'verifyJWTAndAdminRights',
  function (
    req: FastifyRequest,
    res: FastifyReply,
    done: (err?: Error | undefined) => void,
  ) {
    const payload = req.body as { token: string };
    const data = this.jwt.verify(payload.token) as TokenProps;
    if (!data.statusArray.includes('manager')) {
      done(new Error('Your account not have "manager" status'));
      return;
    }

    done();
  },
);

server.decorateRequest('userOrganizerID', '');

server.decorate(
  'verifyJWTAndOrganizerRights',

  function (
    req: FastifyRequest<{ Body: { userOrganizerID: number; token: string } }>,
    res: FastifyReply,
    done: (err?: Error | undefined) => void,
  ) {
    const payload = req.body;
    const data = this.jwt.verify(payload.token) as TokenProps;
    if (data.organizerArray.length === 0) {
      done(new Error('Your account not have "organizer" status'));
      return;
    }
    req.body.userOrganizerID = data.organizerArray[0];

    done();
  },
);

server.after(() => {
  server.register(auth);
  server.register(manager, { prefix: '/manager' });
  server.register(organizer, { prefix: '/organizer' });
});

(async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
