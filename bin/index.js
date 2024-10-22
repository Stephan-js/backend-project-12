import path from 'path';
import { fileURLToPath } from 'url';
import { program } from "commander";
import Fastify from 'fastify';

import plugin from '../src/plugin';

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    const appOptions = {
      staticPath: path.resolve(process.cwd(), options.static),
    };
    const preparedServer = await plugin(fastify, appOptions);
    await preparedServer.listen({ port: '0.0.0.0', host: '5001' });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
