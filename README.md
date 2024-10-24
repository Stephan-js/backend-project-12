# Backend Chat Application

## Installation

To install the necessary package, use the following command:

```bash
npm i chat-app-server
```

## Running the Server

To start the server, run:

```bash
npx start-server
```

### Options for `start-server`

```
Usage: start-server [OPTIONS]

Options:
  -a, --address <address>  Specify the address to listen on (default: "0.0.0.0")
  -p, --port <port>        Specify the port to listen on (default: 5001)
  -s, --static <path>      Path to static asset files (default: "./build")
  -h, --help               Display help for the command
```

---

## User Control

### 1. Create New User
**Endpoint:** `POST /api/account/signup`

**Example Request:**
```javascript
axios.post('/api/account/signup', { username: 'newuser', password: '123456' })
  .then((response) => {
    console.log(response.data); // => { token: ..., username: 'newuser' }
  });
```

### 2. Login
**Endpoint:** `POST /api/account/login`

**Example Request:**
```javascript
axios.post('/api/account/login', { username: 'admin', password: 'admin' })
  .then((response) => {
    console.log(response.data); // => { token: ..., username: 'admin' }
  });
```

## Channels

### 1. Get Channels
**Endpoint:** `GET /api/channels`

**Example Request:**
```javascript
axios.get('/api/channels', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => [{ id: '1', name: 'general', removable: false }, ...]
});
```

### 2. Add Channel
**Endpoint:** `POST /api/channels`

**Example Request:**
```javascript
const newChannel = { name: 'new channel' };

axios.post('/api/channels', newChannel, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => { id: '3', name: 'new channel', removable: true }
});
```

### 3. Edit Channel
**Endpoint:** `PATCH /api/channels/:id`

**Example Request:**
```javascript
const editedChannel = { name: 'new name channel' };

axios.patch('/api/channels/3', editedChannel, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => { id: '3', name: 'new name channel', removable: true }
});
```

### 4. Remove Channel
**Endpoint:** `DELETE /api/channels/:id`

**Example Request:**
```javascript
axios.delete('/api/channels/3', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => { id: '3' }
});
```

## Messages

### 1. Get Messages
**Endpoint:** `GET /api/messages`

**Example Request:**
```javascript
axios.get('/api/messages', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => [{ id: '1', body: 'text message', channelId: '1', username: 'admin' }, ...]
});
```

### 2. Add Message
**Endpoint:** `POST /api/messages`

**Example Request:**
```javascript
const newMessage = { body: 'new message', channelId: '1', username: 'admin' };

axios.post('/api/messages', newMessage, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => { id: '1', body: 'new message', channelId: '1', username: 'admin' }
});
```

### 3. Edit Message
**Endpoint:** `PATCH /api/messages/:id`

**Example Request:**
```javascript
const editedMessage = { body: 'new body message' };

axios.patch('/api/messages/1', editedMessage, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => { id: '1', body: 'new body message', channelId: '1', username: 'admin' }
});
```

### 4. Remove Message
**Endpoint:** `DELETE /api//messages/:id`

**Example Request:**
```javascript
axios.delete('/api/messages/3', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => { id: '3' }
});
```
---

Developed with ❤️ by [Stephan](https://github.com/Stephan-js)
