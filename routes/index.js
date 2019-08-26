var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'index' });
});

module.exports = router;

//module.exports = function (io) {
//    //Socket.IO
//    io.on('connection', function (socket) {
//        console.log('User has connected to Index');
//        //ON Events
//        socket.on('admin', function (data) {
//            console.log('Successful Socket Test');
//            console.log('data: ' + data);
//        });
//        //End ON Events
//    });
//    return router;
//};
