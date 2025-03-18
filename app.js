var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authenticator = require('./components/helpers/authenticator') ;
var permissionsHandler = require('./components/helpers/permissionHandler')
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('debug', true);
async function main() {
  try {
      if (!process.env.MONGO_CONNECTION_STRING) {
          throw new Error('MongoDB connection string is missing in .env file');
      }
      await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          tls: true
      });
      console.log('✅ Connected to MongoDB');
  } catch (err) {
      console.error('❌ MongoDB Connection Error:', err);
      process.exit(1); // Stop the app if MongoDB fails to connect
  }
}

main().catch(err => console.log(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middle wares 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//custom middle-wares
app.use(authenticator);
app.use(permissionsHandler) ;

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
