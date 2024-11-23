/* eslint-disable import/extensions */
import HttpErrors from 'http-errors';
import _ from 'lodash';

import initUsersRoutes from './routes/users.js';
import initMessagesRoutes from './routes/meseges.js';
import initChannelsRoutes from './routes/chanels.js';

const { Unauthorized } = HttpErrors;

const getId = () => _.uniqueId();

const buildStates = (defaultRules) => {
  const state = {
    rules: {
      freeEditChannels: defaultRules[0] ?? true,
      freeEditMessages: defaultRules[1] ?? true,
    },
    channels: [
      {
        id: getId(), name: 'general', removable: false,
      },
      {
        id: getId(), name: 'random', removable: false,
      },
    ],
    // secretChannels: [
    //   {
    //     id: getId(), name: 'general secret', removable: false,
    //   },
    //   {
    //     id: getId(), name: 'random secret', removable: false,
    //   },
    // ],
    messages: [],
    users: [],
  };

  return state;
};

const setSocketAuth = (server, state) => {
  server.io.use((socket, next) => {
    const isHandshake = socket.handshake.query.sid === undefined;
    if (!isHandshake) return next();

    const header = socket.handshake.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return next(new Unauthorized());

    const token = header.substring(7);
    if (token === 'null') return next(new Unauthorized());

    server.jwt.verify(token, 'supersecret', (err, decoded) => {
      const user = state.users.find(({ id }) => id === decoded.userId);
      if (err || !user) return next(new Unauthorized());
      return true;
    });
    return next();
  });
};

export default (server, defualtRules) => {
  const state = buildStates(defualtRules);

  server.io.on('connect', (socket) => {
    console.log({ 'socket.id': socket.id });
  });

  setSocketAuth(server, state);

  initChannelsRoutes(server, state);
  initMessagesRoutes(server, state);
  initUsersRoutes(server, state);

  server
    .get('/', (_req, reply) => {
      reply.sendFile('index.html');
    });
};
