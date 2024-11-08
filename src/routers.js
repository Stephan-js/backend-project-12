import _ from 'lodash';
import HttpErrors from 'http-errors';

import initUsersRoutes from './routes/users.js';
import initMessagesRoutes from './routes/meseges.js';
import initChannelsRoutes from './routes/chanels.js';

const { Unauthorized } = HttpErrors;

const getId = () => _.uniqueId();

const buildStates = (defaultStates) => {
  const state = {
    channels: [
      {
        id: getId(), name: 'general', removable: false, secret: false,
      },
      {
        id: getId(), name: 'random', removable: false, secret: false,
      },
    ],
    messages: [],
    users: [],
  };

  if (defaultStates.messages) state.messages.push(...defaultStates.messages);
  if (defaultStates.channels) state.channels.push(...defaultStates.channels);
  if (defaultStates.users) state.users.push(...defaultStates.users);

  return state;
};

const setSocketAuth = (server, state) => {
  server.io.use((socket, next) => {
    const isHandshake = socket.handshake.query.sid === undefined;
    if (!isHandshake) return next();

    const header = socket.handshake.headers["authorization"];
    if (!header || !header.startsWith("Bearer ")) return next(new Error('invalid token'));

    const token = header.substring(7);
    if (token === 'null') return next(new Error('invalid token'));

    server.jwt.verify(token, 'supersecret', (err, decoded) => {
      const user = state.users.find(({ id }) => id === decoded.userId);
      if (err || !user) return next(new Error('invalid token'));

      socket.user = decoded.data;
      next();
    });
  });
}

export default (server, defualtStates = {}) => {
  const state = buildStates(defualtStates);

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
