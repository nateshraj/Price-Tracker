const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use('/api', require('./routes/auth'), require('./routes/products'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
    server.listen(PORT);
    console.log(`Server started on port ${PORT}`);
  } catch (e) {
    throw Error(`Unable to connect to DB or listen on port ${PORT}` + e);
  }
})();