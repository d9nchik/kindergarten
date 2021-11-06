import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyAuth from 'fastify-auth';
import fastifyJWT from 'fastify-jwt';
import auth, { TokenProps } from './src/auth';
import manager from './src/manager';
import organizer from './src/organizer';

const server = fastify({ logger: true });

server.register(fastifyJWT, { secret: 'supersecret' });
server.register(fastifyAuth);

const headerMissingMessage = 'Missing token header';

server.decorate(
  'verifyJWT',
  function (
    req: FastifyRequest,
    res: FastifyReply,
    done: (err?: Error | undefined) => void,
  ) {
    const auth = req.raw.headers.authorization;
    if (!auth) {
      return done(new Error(headerMissingMessage));
    }
    const data = this.jwt.verify(
      Array.isArray(auth) ? auth[0] : auth,
    ) as TokenProps;
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
    const auth = req.raw.headers.authorization;
    if (!auth) {
      return done(new Error(headerMissingMessage));
    }
    const data = this.jwt.verify(
      Array.isArray(auth) ? auth[0] : auth,
    ) as TokenProps;

    if (!data.statusArray.includes('manager')) {
      return done(new Error('Your account not have "manager" status'));
    }

    done();
  },
);

server.decorateRequest('userOrganizerID', '');

server.decorate(
  'verifyJWTAndOrganizerRights',

  function (
    req: FastifyRequest<{ Body: { userOrganizerID: number } }>,
    res: FastifyReply,
    done: (err?: Error | undefined) => void,
  ) {
    req.jwtVerify();
    const auth = req.raw.headers.authorization;
    if (!auth) {
      return done(new Error(headerMissingMessage));
    }
    const data = this.jwt.verify(auth) as TokenProps;
    if (data.organizerArray.length === 0) {
      return done(new Error('Your account not have "organizer" status'));
    }
    if (req.body !== null) req.body.userOrganizerID = data.organizerArray[0];

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
