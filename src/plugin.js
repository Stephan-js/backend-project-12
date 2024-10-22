import fastifySocketIo from 'fastify-socket.io';
import fastifyStatic from '@fastify/static';
import fastifyJWT from '@fastify/jwt';
import HttpErrors from 'http-errors';

import addRoutes from './routers.js'

const { Unauthorized } = HttpErrors;

const setUpStaticAss = (fastify, buildPath) => {
  fastify.register(fastifyStatic, {
    root: buildPath,
  });

  fastify.setNotFoundHandler((req, res) => {
    res.sendFile('index.html');
  });
};

const setUpAuth = (fastify) => {
  // TODO add socket auth
  fastify
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

export default async (fastify, options) => {
  setUpAuth(fastify);
  setUpStaticAss(fastify, options.staticPath);
  await fastify.register(fastifySocketIo);
  addRoutes(fastify, options?.state || {});

  return fastify;
};
