var express = require('express');
var router = express.Router();


router.get('/item', function (req, res){
    console.log('Received ' + req.params.name + ' data');
    const wanted = items.filter( function(item){return (item.name === req.params.name);} );
    console.log(wanted.name + wanted.length);
    res.render(__dirname + "/views/item.html", { comments: comments, name: items[0].name, price: items[0].price, image: items[0].image, developers: items[0].developers, platforms: items[0].platforms, versions: items[0].versions, link: items[0].link });
});

module.exports = router;
