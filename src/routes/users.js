import _ from 'lodash';
import HttpErrors from 'http-errors';

const { Unauthorized, Conflict } = HttpErrors;

const getId = () => _.uniqueId();

export default (server, state) => {
  server.post('/api/account/login', async (req, reply) => {
    const username = _.get(req.body, 'username');
    const password = _.get(req.body, 'password');
    const user = state.users.find((u) => u.username === username);

    if (!user || user.password !== password) {
      reply.send(new Unauthorized());
      return;
    }

    const token = server.jwt.sign({ userId: user.id });
    reply.send({ token, user });
  });

  server.delete('/api/account', { preValidation: [server.authenticate] }, async (req, reply) => {
    const user = state.users.find(({ id }) => id === req.user.userId);
    if (!user) {
      reply.send(new Unauthorized());
      return;
    }

    _.remove(state.users, ({ id }) => id === req.user.userId)

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(user.name);
  });

  server.post('/api/account/signup', async (req, reply) => {
    const username = _.get(req.body, 'username');
    const password = _.get(req.body, 'password');
    const user = state.users.find((u) => u.username === username);

    if (user) {
      reply.send(new Conflict());
      return;
    }

    const newUser = { id: getId(), username, password, admin: false };
    const token = server.jwt.sign({ userId: newUser.id });
    state.users.push(newUser);
    reply
      .code(201)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ token, user });
  });
};
