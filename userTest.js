var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./ncldb2.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to database');
});

db.serialize(function() {
	db.each('Select rowid AS id, full_name, username, company, email, password FROM members', function(err, row) {
		if (err) {
			return console.log(err.message);
		}
		console.log(row.id + ': ' + row.full_name + ' ' + row.username + ' ' + row.company + ' ' + row.email + ' ' + row.password);
	});
});

db.close();