/* eslint-disable no-param-reassign */
import _ from 'lodash';
import HttpErrors from 'http-errors';

const { Unauthorized, NotFound } = HttpErrors;

const getNextId = () => _.uniqueId();

export default (server, state) => {
  server.get('/api/channels', { preValidation: [server.authenticate] }, (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(state.channels);
  });

  server.post('/api/channels', { preValidation: [server.authenticate] }, async (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }
    if (!user.admin && !state.rules.channels.freeAdd) {
      reply.send(new Unauthorized());
      return;
    }

    const channel = req.body;
    const channelWithId = {
      ...channel,
      removable: true,
      id: getNextId(),
    };
    state.channels.push(channelWithId);
    server.io.emit('newChannel', channelWithId);

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(channelWithId);
  });

  server.patch('/api/channels/:channelId', { preValidation: [server.authenticate] }, async (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }
    if (!user.admin && !state.rules.channels.freeRename) {
      reply.send(new Unauthorized());
      return;
    }

    const { channelId } = req.params;
    const { name } = req.body;
    const channel = state.channels.find(({ id }) => id === channelId);
    if (!channel) {
      reply.send(new NotFound());
      return;
    }
    channel.name = name;

    server.io.emit('renameChannel', channel);
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(channel);
  });

  server.delete('/api/channels/:channelId', { preValidation: [server.authenticate] }, async (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }
    if (!user.admin && !state.rules.channels.freeDelete) {
      reply.send(new Unauthorized());
      return;
    }

    const { channelId } = req.params;
    state.channels = state.channels.filter(({ id }) => id !== channelId);
    state.messages = state.messages.filter((messege) => messege.channelId !== channelId);
    const data = { id: channelId };

    server.io.emit('removeChannel', data);
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(data);
  });
};
