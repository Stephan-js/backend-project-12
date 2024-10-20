/* eslint-disable no-param-reassign */
import _ from 'lodash';
import HttpErrors from 'http-errors';

const { Unauthorized } = HttpErrors;

const getNextId = () => _.uniqueId();

export default (app, state) => {
  app.get('/api/v1/channels', { preValidation: [app.authenticate] }, (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);

    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(state.channels);
  });

  app.post('/api/v1/channels', { preValidation: [app.authenticate] }, async (req, reply) => {
    const channel = req.body;
    const channelWithId = {
      ...channel,
      removable: true,
      id: getNextId(),
    };
    state.channels.push(channelWithId);
    app.io.emit('newChannel', channelWithId);

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(channelWithId);
  });

  app.patch('/api/v1/channels/:channelId', { preValidation: [app.authenticate] }, async (req, reply) => {
    const { channelId } = req.params;
    const { name } = req.body;
    const channel = state.channels.find((c) => c.id === channelId);
    if (!channel) {
      reply.code(404);
      return;
    }
    channel.name = name;

    app.io.emit('renameChannel', channel);
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(channel);
  });

  app.delete('/api/v1/channels/:channelId', { preValidation: [app.authenticate] }, async (req, reply) => {
    const { channelId } = req.params;
    state.channels = state.channels.filter((c) => c.id !== channelId);
    state.messages = state.messages.filter((m) => m.channelId !== channelId);
    const data = { id: channelId };

    app.io.emit('removeChannel', data);
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(data);
  });
};
