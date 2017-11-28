var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to database');
});

db.serialize(function() {
	db.each('Select rowid AS id, name, company, email, password FROM User', function(err, row) {
		if (err) {
			return console.log(err.message);
		}
		console.log(row.id + ': ' + row.name + ' ' + row.company + ' ' + row.email + ' ' + row.password);
	});
});

db.close();