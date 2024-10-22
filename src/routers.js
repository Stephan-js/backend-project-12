import _ from 'lodash';
import HttpErrors from 'http-errors';

import initUsersRoutes from './routes/users.js';
import initMessagesRoutes from './routes/meseges.js';
import initChannelsRoutes from './routes/chanels.js';

const { Unauthorized, Conflict } = HttpErrors;

const getId = () => _.uniqueId();

const buildStates = (defaultStates) => {
  const generalChannelId = getId();
  const randomChannelId = getId();
  const state = {
    channels: [
      { id: generalChannelId, name: 'general', removable: false, secret: false },
      { id: randomChannelId, name: 'random', removable: false, secret: false },
    ],
    messages: [],
    currentChannelId: generalChannelId,
    users: [],
  };

  if (defaultStates.messages) {
    state.messages.push(...defaultStates.messages);
  }
  if (defaultStates.channels) {
    state.channels.push(...defaultStates.channels);
  }
  if (defaultStates.currentChannelId) {
    state.currentChannelId = defaultStates.currentChannelId;
  }
  if (defaultStates.users) {
    state.users.push(...defaultStates.users);
  }

  return state;
};

export default (server, defualtStates = {}) => {
  const state = buildStates(defualtStates);

  server.io.on('connect', (socket) => {
    console.log({ 'socket.id': socket.id });
  });

  initChannelsRoutes(server, state);
  initMessagesRoutes(server, state);
  initUsersRoutes(server, state);

  server
    .get('/', (_req, reply) => {
      reply.sendFile('index.html');
    });
};
