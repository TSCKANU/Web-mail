var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // 세션 user 체크
    if (req.session.user) {
        // 로그인 된 상태.
        console.log('로그아웃.');
        
        req.session.destroy(function(err) {
            if (err) { 
                console.log('로그아웃 실패: ' + err.stack);
                res.render('logout_process', { title: 'logout',
                                                Message: '로그아웃을 실패하였습니다.',
                                                result: 'fail' });
            }
            
            console.log('세션 삭제. 로그아웃 성공.');
            res.render('logout_process', { title: 'logout',
                                            Message: '로그아웃 성공하였습니다.',
                                            result: 'success' });
        });
    } else {
        // 로그인이 안된 상태.
        console.log('아직 로그인이 되어 있지 않습니다.');
        res.render('logout_process', { title: 'logout',
                                        Message: '로그인이 아직 안되어있습니다.', 
                                        result: 'success' });
    }
});

module.exports = router;