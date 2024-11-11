import fastifySocketIo from 'fastify-socket.io';
import fastifyStatic from '@fastify/static';
import fastifyJWT from '@fastify/jwt';
import HttpErrors from 'http-errors';

// eslint-disable-next-line import/extensions
import addRoutes from './routers.js';

const { Unauthorized } = HttpErrors;

const setUpStaticAss = (server, buildPath) => {
  server.register(fastifyStatic, {
    root: buildPath,
  });

  server.setNotFoundHandler((req, res) => {
    res.sendFile('index.html');
  });
};

const setUpAuth = (server) => {
  server
    .register(fastifyJWT, {
      secret: 'supersecret',
    })
    .decorate('authenticate', async (req, reply) => {
      try {
        await req.jwtVerify();
      } catch (_err) {
        reply.send(new Unauthorized());
      }
    });
};

export default async (server, options) => {
  setUpAuth(server);
  setUpStaticAss(server, options.staticPath);
  await server.register(fastifySocketIo);
  addRoutes(server, options?.state || {});

  return server;
};
