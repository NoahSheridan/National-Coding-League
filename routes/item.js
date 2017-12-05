var express = require('express');
var router = express.Router();


// router.get('/', function(req, res, next) {
//     res.sendFile(__dirname + "/views/item.html");
// });

var test = "Test Object Name";

router.get('/item', function(req, res) {
    console.log("item.js route used")
    res.render(__dirname + '/views/item.html', { name:test, price:"$900" });
});

module.exports = router;
