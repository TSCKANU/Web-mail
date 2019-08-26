var express = require('express');
var router = express.Router();

var userDB = require('../config/DB/userDB');

/* GET home page. */
router.get('/', function(req, res, next) {
    // user 세션이 있는지 확인.
    if (req.session.user) {
        // 이미 로그인이 된 상태
        console.log('세션이 존재함.');
        console.log('세션 user id: ' + req.session.user.id);
        
        res.render('main', { title: 'main',
                                id: req.session.user.id,
                                name: req.session.user.name });
        return;
    }
    res.render('login', { title: 'index' });
});

router.post('/', function(req, res, next) {
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    userDB.authUser(paramId, paramPassword, function(err, rows) {
        if (err) {
            console.log('로그인 중 오류 발생: ' + err.stack);
            
            res.render('login_process', { Message: '로그인에 실패하였습니다.',
                                            result: 'fail' });
            return;
        }
        
        if (rows) {
            console.dir(rows);
            
            var username = rows[0].name;
            var userId = rows[0].id;
            
            // user 세션 저장.
            req.session.user = {
                id: userId,
                name: username,
                authorized: true
            }
            
            res.render('login_process', { Message: '로그인에 성공하였습니다.',
                                            result: 'success' });
            return;
        }
        
        res.render('login_process', { Message: '로그인에 실패하였습니다.',
                                            result: 'fail' });
    });
});

module.exports = router;