var express = require('express');
var router = express.Router();


// router.get('/', function(req, res, next) {
//     res.sendFile(__dirname + "/views/item.html");
// });

var test = "TESTTETETFBFJHSVJ"

router.get('/item', function(req, res, next) {
    res.render(__dirname + 'item.html', { name:test, price:"$900" });
});

module.exports = router;
