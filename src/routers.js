/* eslint-disable no-unused-vars */
import _ from 'lodash';
import HttpErrors from 'http-errors';

import initChannelsRoutes from './routes/channels.js';
import initMessagesRoutes from './routes/messages.js';
import initUsersRoutes from './routes/users.js';

const { Unauthorized, Conflict } = HttpErrors;

const getNextId = () => _.uniqueId();

const buildState = (defaultState) => {
  const generalChannelId = getNextId();
  const randomChannelId = getNextId();
  const state = {
    channels: [
      { id: generalChannelId, name: 'general', removable: false },
      { id: randomChannelId, name: 'random', removable: false },
    ],
    messages: [],
    currentChannelId: generalChannelId,
    users: [
      { id: 1, username: 'admin', password: 'acdmin' },
    ],
  };

  if (defaultState.messages) {
    // @ts-ignore
    state.messages.push(...defaultState.messages);
  }

  if (defaultState.channels) {
    state.channels.push(...defaultState.channels);
  }

  if (defaultState.currentChannelId) {
    state.currentChannelId = defaultState.currentChannelId;
  }
  if (defaultState.users) {
    state.users.push(...defaultState.users);
  }

  return state;
};

export default (app, defaultState = {}) => {
  const state = buildState(defaultState);

  app.io.on('connect', (socket) => {
    console.log({ 'socket.id': socket.id });
  });

  initChannelsRoutes(app, state);
  initMessagesRoutes(app, state);
  initUsersRoutes(app, state);

  app
    .get('/', (_req, reply) => {
      reply.sendFile('index.html');
    });
};
