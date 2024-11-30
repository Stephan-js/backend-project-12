# Chat Application Backend Documentation

todo: rewrite documentation and add more details

Simple backend server for a chat application built with Fastify and Socket.IO.

[Frontend Repo Example](https://github.com/Stephan-js/frontend-project-12)

## Installation

To install the necessary package, use the following command:

```bash
npm i -s chat-app-server
```

## Running the Server

To start the server, run:

```bash
npx start-server
```

### Options for start-server


```
Usage: start-server [OPTIONS]

Options:
  -a, --address <address>  Specify the address to listen on (default: "0.0.0.0")
  -p, --port <port>        Specify the port to listen on (default: 5001)
  -s, --static <path>      Path to static asset files (default: "./build")
  -r, --rule <rule>        Set server rules as a comma-separated list:
                           - First value: Allow all users to delete/rename channels (true/false)
                           - Second value: Allow all users to edit messages (true/false)
                           (default: "true,true")
  -h, --help               Display help for the command
```


### Rule Settings

The `-r` or `--rule` option accepts a pair of boolean values to configure server behavior. 

1. **Channel Editing Rule**  
   - `true`: All users can delete or rename channels.  
   - `false`: Only admins can delete or rename channels.  

2. **Message Editing Rule**  
   - `true`: All users can edit their own messages.  
   - `false`: Only admins can edit messages.  


## User Control

### 1. Create New User
**Endpoint:** `POST /api/account/signup`

**Example Request:**
```javascript
axios.post('/api/account/signup', { username: 'user', password: '123456' })
  .then((response) => {
    console.log(response.data); // => { token: ... }
  });
```

### 2. Login
**Endpoint:** `POST /api/account/login`

**Example Request:**
```javascript
axios.post('/api/account/login', { username: 'user', password: '123456' })
  .then((response) => {
    console.log(response.data); // => { token: ... }
  });
```

### 3. Delete
**Endpoint:** `DELETE /api/account/:username`

**Example Request:**
```javascript
// Admins can delete any user account. Regular users can only delete their own.
axios.delete('/api/account/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
).then((response) => {
  console.log(response.data); // Example response: { username: 'user' }
});
```

### 4. Rename
**Endpoint:** `PATCH /api/account/:username`

**Example Request:**
```javascript
// Admins can renames any user account. Regular users can only rename their own.
axios.patch('/api/account/user', { username: 'newName' }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
).then((response) => {
  console.log(response.data); // Example response: { username: 'newName' }
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
  console.log(response.data); // => [{ id: '1', body: 'text message', channelId: '1', username: 'user' }, ...]
});
```

### 2. Add Message
**Endpoint:** `POST /api/messages`

**Example Request:**
```javascript
const newMessage = { body: 'new message', channelId: '1' };

axios.post('/api/messages', newMessage, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  console.log(response.data); // => { id: '1', body: 'new message', channelId: '1', username: 'user' }
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
  console.log(response.data); // => { id: '1', body: 'edited message', channelId: '1', username: 'user' }
});
```

### 4. Remove Message
**Endpoint:** `DELETE /api/messages/:id`

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

## Socket event subscribes

### Set up Socket.io

```javascript

const socket = io({
  extraHeaders: {
    authorization: `Bearer ${token}`,
  },
});

```

### 1. Subscribe new messages

```javascript

socket.on('newMessage', (payload) => {
  console.log(payload); // => { id: '2', body: 'edited message', channelId: '1', username: 'user' }
});

```

### 2. Subscribe new channel

```javascript

socket.on('newChannel', (payload) => {
  console.log(payload) // { id: '6', name: "new channel", removable: true }
});
  
```

### 3. Subscribe remove channel

```javascript


socket.on('removeChannel', (payload) => {
  console.log(payload); // { id: '6' };
});

```

### 4. Subscribe rename channel

```javascript

socket.on('renameChannel', (payload) => {
  console.log(payload); // { id: '7', name: "new name channel", removable: true }
});

```
---


Developed with ❤️ by [Stephan](https://github.com/Stephan-js)
