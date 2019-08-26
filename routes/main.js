var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // 세션이 존재하는지 확인
    if (req.session.user) {
        // 세션이 존재하는 경우.
        var id = req.session.user.id;
        var name = req.session.user.name;
        
        console.log('id: [%s], name: [%s]', id, name);
    
        res.render('main', { title: 'main', id: id, name: name });
    } else {
        // 세션이 존재하지 않은 경우.
        res.render('login_process', { Message: '로그인이 아직 안되어있습니다.',
                                            result: 'fail' });
    }
});

module.exports = router;