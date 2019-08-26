var express = require('express');
var router = express.Router();

var userDB = require('../config/DB/userDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'signup' });
});

router.post('/', function(req, res, next) {
    var id = req.body.id || req.query.id;
    var password = req.body.password || req.query.password;
    var name = req.body.name || req.query.name;
    var phone = req.body.phone || req.query.phone;
    var birth_date = req.body.birth_date || req.query.birth_date;
    
    userDB.addUser(id, password, name, phone, birth_date, function(err, addedUser) {
        // 동일한 id로 추가할 때 오류 발생
        if (err) {
            console.log('사용자 추가 중 오류 발생: ' + err.stack);
            
            res.render('signup_process', { Message: '중복된 아이디 입니다.',
                                            result: 'fail' });
            return;
        }
        
        if (addedUser) {
            console.dir(addedUser);
            
            var insertId = addedUser.insertId;
            console.log('추가한 레코드의 아이디: ' + insertId);
            
            res.render('signup_process', { Message: '회원가입에 성공하였습니다.',
                                            result: 'success' });
        }
    });
});

module.exports = router;