/* eslint-disable no-param-reassign */
import _ from 'lodash';
import HttpErrors from 'http-errors';

const { Unauthorized, NotFound } = HttpErrors;

const getNextId = () => _.uniqueId();

export default (server, state) => {
  server.get('/api/messages', { preValidation: [server.authenticate] }, (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    reply
      .header('Content-Type', 'serverlication/json; charset=utf-8')
      .send(state.messages);
  });

  server.post('/api/messages', { preValidation: [server.authenticate] }, async (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    const message = req.body;
    const messageWithId = {
      ...message,
      username: user.username,
      removable: true,
      id: getNextId(),
    };
    state.messages.push(messageWithId);
    server.io.emit('newMessage', messageWithId);

    reply
      .header('Content-Type', 'serverlication/json; charset=utf-8')
      .send(messageWithId);
  });

  server.patch('/api/messages/:messageId', { preValidation: [server.authenticate] }, async (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    const { messageId } = req.params;
    const { body } = req.body;
    const message = state.messages.find(({ id }) => id === messageId);
    if (!message) {
      reply.send(new NotFound());
      return;
    }
    message.body = body;

    server.io.emit('renameMessage', message);
    reply
      .header('Content-Type', 'serverlication/json; charset=utf-8')
      .send(message);
  });

  server.delete('/api/messages/:messageId', { preValidation: [server.authenticate] }, async (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    const { messageId } = req.params;
    state.messages = state.messages.filter(({ id }) => id !== messageId);
    const data = { id: messageId };

    server.io.emit('removeMessage', data);
    reply
      .header('Content-Type', 'serverlication/json; charset=utf-8')
      .send(data);
  });
};
