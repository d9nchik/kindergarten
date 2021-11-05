import fastify from 'fastify';
import { FastifyAuthFunction } from 'fastify-auth';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse,
  > {
    verifyJWT: FastifyAuthFunction;
  }
}
