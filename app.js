var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var ejs = require('ejs')

var index = require('./routes/index.js');
var users = require('./routes/users.js');
//var item =  require('./routes/item.js');
var item = require(__dirname + "/routes/item")

var app = express();
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./ncldb2.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to database');
});

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

var items = [];

db.serialize(function() {
	db.each("Select rowid AS id, app_name, developers, platforms, versions, external_link, price, status, image_link FROM entries", function(err, row) {
		items.push({name: row.app_name, developers: row.developers, platforms: row.platforms, price: row.price, versions: row.versions, link: row.external_link, image: row.image_link});
	});
});

//START ROUTING ====================================

app.use('/item', function (req, res){
    console.log('Received ' + req.params.name + ' data');
    const wanted = items.filter( function(item){return (item.name === req.params.name);} );
    console.log(wanted.name + wanted.length);
    res.render(__dirname + "/views/item.html", { name: items[0].name, price: items[0].price, image: items[0].image });
});

//app.use('/item', item);

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

app.post('/app_submit', function(req, res) {
	var username = req.body.userName;
	var appname = req.body.appName;
	var developers = req.body.developerNames;
	var platform = req.body.platformName
	var version = req.body.version;
	var price = req.body.appPrice;
	var link = req.body.externalLink;
	var sportType = 0;
	var appType = 0;
	var memberID = 0;
	
	db.run('INSERT INTO entry_requests(member_id, app_name, developers, platforms, versions, external_link, price, sport_id, app_type_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [memberID, appname, developers, platform, version, link, price, sportType, appType], function(err) {
		if (err) {
			return console.log(err.message);
		}
		console.log('An app has been submitted for request');
	});
	
	res.render(__dirname + "/views/indexLoggedIn.html", {items:items});
});

app.post('/sign_in', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var login = false;
	
	db.serialize(function() {
		db.each('Select rowid AS id, email, password, administrator FROM members', function(err, row) {
			if (err) {
				return console.log(err.message);
			}
			if (row.email == email && row.password == password && row.administrator == 0) {
				login = true;
				res.render(__dirname + "/views/indexLoggedIn.html", {items:items});
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

module.exports = app;