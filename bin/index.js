#!/usr/bin/env node

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
  .option('-r, --rule <rule>', 'Set custom server rules', 'true,true')
  .parse(process.argv);

const options = program.opts();

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    const appOptions = {
      staticPath: path.resolve(process.cwd(), options.static),
      rules: options.rule.split(',').map((e) => e === 'true'),
    };
    const preparedServer = await plugins(fastify, appOptions);
    await preparedServer.listen({ port: options.port, host: options.address });
  } catch (err) {
    throw new Error(err);
  }
};

start();
