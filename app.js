'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var api1 = require('./routes/api1');
var api2 = require('./routes/api2');

//站点配置
var settings = require("./settings");
//数据库操作对象
var DbOpt = require("./models/Dbopt");
/*模板引擎*/
var partials = require('express-partials');

//数据库同步模块
var sync2db = require('./util/sync2db');
sync2db();

var app = express();

app.locals.version='insb v 0.0.1';
//数据格式化
var moment = require('moment');
app.locals.myDateFormat = function(date){
  moment.locale('zh-cn');
  return moment(date).startOf('hour').fromNow();
};
app.locals.unix2Date = function(timestamp) {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

//解决异步层次混乱问题
app.use(require('express-promise')());
// var session = require('express-session');
// var LevelStore = require('level-session-store')(session);
//
// app.use(session({
//   secret: 'yoxlol',
//   name: 'unme8',
//   httpOnly: true,
//   cookie: {maxAge: 10 * 60 * 1000},
//   resave: false,
//   saveUninitialized: false,
//   store: new LevelStore(path.join(__dirname, 'levelSession.db'))
// }));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/v1', api1);
app.use('/api/v2', api2);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
