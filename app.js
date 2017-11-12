var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');

var index = require('./routes/index');
var users = require('./routes/users');
var item =  require('./routes/item');

var app = express();
var router = express.Router();


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

//START ROUTING ====================================

app.use('/item', function (req, res) {
    res.sendFile(__dirname + "/views/item.html");
});

app.use('/login', function (req, res) {
	res.sendFile(__dirname + "/views/login.html");
});

app.use('/register', function (req, res) {
	res.sendFile(__dirname + "/views/register.html")
})

//This must go last or else it will only redirect to
//the homepage
app.use('/', function(req, res) {
     res.sendFile(__dirname + "/views/index.html");
});

//END ROUTING ======================================

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

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('mydb.db');
// var check;
// db.serialize(function() {
//
//   db.run("CREATE TABLE if not exists user_info (name TEXT, developers TEXT, platform TEXT, version TEXT, price TEXT)");
//   var stmt = db.prepare("INSERT INTO user_info VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();
//
//   db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });
//
// db.close();

module.exports = app;
