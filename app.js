var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var ejs = require('ejs')

var index = require('./routes/index');
var users = require('./routes/users');
var item =  require('./routes/item');

var app = express();
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./ncldb2.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to database');
});

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

//Fake items to simulate database
const items = [
    {
        name: "ESPN",
        author: 'John',
        rating: '&#9733; &#9733; &#9733; &#9733; &#9733;',
        body: 'Description',
        price: '$0.99'
    },
    {
        name: 'Fantasy Football Simulator 2018',
        author: 'Drake',
        rating: '&#9733; &#9733; &#9734; &#9734; &#9734;',
        body: 'Description',
        price: '$1.99'
    },
    {
        name: 'MLB Official Scoreboard',
        author: 'Emma',
        rating: '&#9733; &#9733; &#9733; &#9733; &#9734;',
        body: 'Description',
        price: '$0.99'
    },
    {
        name: 'Cawlidge Hawkey',
        author: 'Cody',
        rating: '&#9733; &#9733; &#9733; &#9733; &#9733;',
        body: 'Description',
        price: '$2.99'
    },
    {
        name: 'Sports r Neat',
        author: 'Cody',
        rating: '&#9733; &#9733; &#9733; &#9733; &#9733;',
        body: 'Description',
        price: '$1002.99'
    }
]


//START ROUTING ====================================

app.use('/item', function (req, res){
    console.log('Received ' + req.params.name + ' data');
    const wanted = items.filter( function(item){return (item.name === req.params.name);} );
    console.log(wanted.name + wanted.length);
    res.render(__dirname + "/views/item.html", { name: items[0].name, price: items[0].price });
});

app.use('/login', function (req, res) {
	res.sendFile(__dirname + "/views/login.html");
});

app.use('/register', function (req, res) {
	res.sendFile(__dirname + "/views/register.html");
});

app.use('/appsub', function (req, res) {
	res.sendFile(__dirname + "/views/appsub.html");
});

app.use('/home', function (req, res) {
	res.render(__dirname + "/views/indexLoggedIn.html", {items:items});
});

app.use('/admin_home', function (req, res) {
	res.render(__dirname + "/views/indexAdmin.html", {items:items});
});

app.post('/create_account', function(req, res) {
	var name = req.body.name;
	var username = req.body.user;
	var company = req.body.company;
	var email = req.body.email;
	var password = req.body.password;
	var administrator = 0;
	var login = false;
	
	db.run('INSERT INTO members(full_name, username, company, email, password, administrator) VALUES(?, ?, ?, ?, ?, ?)', [name, username, company, email, password, administrator], function(err) {
		if (err) {
			return console.log(err.message);
		}
		console.log('A new user has been added');
	});
	
	res.sendFile(__dirname + "/views/login.html");
});

app.post('/sign_in', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	
	db.serialize(function() {
		db.each('Select rowid AS id, email, password, administrator FROM members', function(err, row) {
			if (err) {
				return console.log(err.message);
			}
			if (row.email == email && row.password == password && row.administrator == 0) {
				login = true;
				res.render(__dirname + "/views/indexLoggedIn.html", {items:items, username:username});
				return console.log('Login Successful');
			}
			if (row.email == email && row.password == password && row.administrator == 1) {
				login = true;
				res.render(__dirname + "/views/indexAdmin.html", {items:items});
				return console.log('Admin Login Successful');
			}
		});
	});
	if (login == false) {
		res.sendFile(__dirname + "/views/login.html")
	}
});

//This must go last or else it will only redirect to
//the homepage
app.use('/', function(req, res) {
     res.render(__dirname + "/views/index.html", {items:items});
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

module.exports = app;
