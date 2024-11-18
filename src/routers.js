/* eslint-disable import/extensions */
import _ from 'lodash';

import initUsersRoutes from './routes/users.js';
import initMessagesRoutes from './routes/meseges.js';
import initChannelsRoutes from './routes/chanels.js';

const getId = () => _.uniqueId();

const buildStates = (defaultRules) => {
  const state = {
    rules: {
      freeEditChannels: defaultRules[0],
      freeEditMessages: defaultRules[1],
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

    const error = new Error('invalid token');
    const header = socket.handshake.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return next(error);

    const token = header.substring(7);
    if (token === 'null') return next(error);

    server.jwt.verify(token, 'supersecret', (err, decoded) => {
      const user = state.users.find(({ id }) => id === decoded.userId);
      if (err || !user) return next(error);
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
