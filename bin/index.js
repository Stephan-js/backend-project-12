#! /usr/bin/env node
/* eslint-disable no-underscore-dangle */

import path from 'path';
import { fileURLToPath } from 'url';
import Fastify from 'fastify';
import { program } from 'commander';
import readPackageJson from 'read-package-json-fast';

import plugin from '../src/plugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5001;
const staticPath = path.join(process.cwd(), 'build');
const packageSource = await readPackageJson(path.join(__dirname, '../package.json'));

program
  .version(packageSource.version, '-v, --version')
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
    const preparedServer = await plugin(fastify, appOptions);
    await preparedServer.listen({ port: options.port, host: options.address });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
