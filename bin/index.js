#! /usr/bin/env node

import path from 'path';
import { program } from 'commander';
import Fastify from 'fastify';
import plugins from '../src/plugin.js';

const port = process.env.PORT || 5001;
const staticPath = path.join(process.cwd(), 'build');

program
  .usage('[OPTIONS]')
  .option('-a, --address <address>', 'address to listen on', '0.0.0.0')
  .option('-p, --port <port>', 'port to listen on', port)
  .option('-s, --static <path>', 'path to static assets files', staticPath)
  .parse(process.argv);

const options = program.opts();

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    const appOptions = {
      staticPath: path.resolve(process.cwd(), options.static),
    };
    const preparedServer = await plugins(fastify, appOptions);
    await preparedServer.listen({ port: options.port, host: options.address });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
