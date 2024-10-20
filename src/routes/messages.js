import _ from 'lodash';
import HttpErrors from 'http-errors';

const { Unauthorized } = HttpErrors;

const getNextId = () => _.uniqueId();

export default (app, state) => {
  app.get('/api/v1/messages', { preValidation: [app.authenticate] }, (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);

    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(state.messages);
  });

  app.post('/api/v1/messages', { preValidation: [app.authenticate] }, async (req, reply) => {
    const message = req.body;
    const messageWithId = {
      ...message,
      removable: true,
      id: getNextId(),
    };
    state.messages.push(messageWithId);
    app.io.emit('newMessage', messageWithId);

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(messageWithId);
  });

  app.patch('/api/v1/messages/:messageId', { preValidation: [app.authenticate] }, async (req, reply) => {
    const { messageId } = req.params;
    const { body } = req.body;
    const message = state.messages.find((c) => c.id === messageId);
    if (!message) {
      reply.code(404);
      return;
    }
    message.body = body;

    app.io.emit('renameMessage', message);
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(message);
  });

  app.delete('/api/v1/messages/:messageId', { preValidation: [app.authenticate] }, async (req, reply) => {
    const { messageId } = req.params;
    // eslint-disable-next-line no-param-reassign
    state.messages = state.messages.filter((m) => m.id !== messageId);
    const data = { id: messageId };
    app.io.emit('removeMessage', data);
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(data);
  });
};
