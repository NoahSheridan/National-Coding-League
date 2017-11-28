var express = require('express');
var router = express.Router();


// router.get('/', function(req, res, next) {
//     res.sendFile(__dirname + "/views/item.html");
// });

router.get('/', function(req, res, next) {
    res.render(__dirname + 'appsub.html', { title: "Application Submission Request" });
});



module.exports = router;