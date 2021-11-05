import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyAuth from 'fastify-auth';
import fastifyJWT from 'fastify-jwt';
import auth, { TokenProps } from './src/auth';

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

server.after(() => {
  server.register(auth);
});

(async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
