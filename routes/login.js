var express = require('express');
var router = express.Router();


// router.get('/', function(req, res, next) {
//     res.sendFile(__dirname + "/views/item.html");
// });

router.get('/', function(req, res, next) {
    res.render(__dirname + 'login.html', { myTestVar:"Item Test Title", price:"$900" });
});

module.exports = router;