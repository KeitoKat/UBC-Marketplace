const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config/database');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');
const gptRouter = require('./routes/gpt');
const uploadRouter = require('./routes/upload');
const conversationRouter = require('./routes/conversation');
const itemReportRouter = require('./routes/itemReports');
const userReportRouter = require('./routes/userReports');
const ordersRouter = require('./routes/orders');

// Connect to MongoDB
mongoose
  .connect(config.DB_URL)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);
app.use('/auth', authRouter);
app.use('/gpt-suggest', gptRouter);
app.use('/upload', uploadRouter);
app.use('/itemReports', itemReportRouter);
app.use('/userReports', userReportRouter);
app.use('/conversations', conversationRouter);
app.use('/orders', ordersRouter);

// Error handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
