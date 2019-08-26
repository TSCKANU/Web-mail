var express = require('express');
var fs = require('fs');
// 시간 관련 모듈 js.
var moment = require('moment');
var mime = require('mime');
var router = express.Router();

var userDB = require('../config/DB/userDB');
var upload = require('../config/upload');
var mailDB = require('../config/DB/mailDB');
var pageInfo = require('../config/pageInfo');

/* GET home page. */
// 받은 메일함(mail index) 라우팅
router.get('/reclist/:curPage', function(req, res, next) {
    // 세션이 존재하는지 확인
    if (req.session.user) {
        // 세션이 존재하는 경우.
        var id = req.session.user.id;
        var name = req.session.user.name;
        
        console.log('id: [%s], name: [%s]', id, name);
        
        var curPage = (req.params.curPage == null ? 1 : req.params.curPage); // 현재페이지
        
        var numPerPage = 1;					// 한 페이지에 보여지는 메일 수
        var totalRecord = 0;			    // 전체 받은 메일 수
        
        var table = 'rec_mail';                  // (받은(rec_id), 보낸(send_id)) 메일 타입 결정.
        var type = 'rec_id';
                                            // (전체(''))
        mailDB.listMail(id, table, type, function(err, rows) {
            var lists = false;
            if (err) {
                console.log('받은메일 리스트 조회 중 오류 발생: ' + err.stack);
                
                nextStep(lists);
                
                return;
            }

            if (rows) {
                console.dir(rows);
                
                totalRecord = rows.length;
                
                lists = rows;
                
                nextStep(lists);

                return;
            }
            nextStep(lists); 
        });
         
        function nextStep(lists) {
            // 페이지 [이전] 1 [다음] 관련 모듈.
            // 한 페이지에 메일 10개, 5페이지 후 [다음] 활성화
            pageInfo(totalRecord, curPage, numPerPage, 5, function(err, pageData) {
                if (err) {
                    console.log('pageData 받아오기 실패: ' + err.stack);
                    
                    res.render('mailList_rec', { title: 'mail', id: id, 
                                        name: name, lists: lists,
                                        curPage: curPage, numPerPage: numPerPage,
                                        totalRecord: totalRecord, 
                                        pageData: false });
                    return;
                }

                if (pageData) {
                    console.dir(pageData);
                    
                    res.render('mailList_rec', { title: 'mail', id: id, 
                                        name: name, lists: lists,
                                        curPage: curPage, numPerPage: numPerPage,
                                        totalRecord: totalRecord, 
                                        pageData: pageData });
                    
                    return;
                }
                
                res.render('mailList_rec', { title: 'mail', id: id, 
                                        name: name, lists: lists,
                                        curPage: curPage, numPerPage: numPerPage,
                                        totalRecord: totalRecord, 
                                        pageData: false });
            });
        } 
        
        //res.render('mail', { title: 'main', id: id, name: name });
    } else {
        // 세션이 존재하지 않은 경우.
        res.render('login_process', { Message: '로그인이 아직 안되어있습니다.',
                                            result: 'fail' });
    }
});

// 보낸 메일함 라우팅
router.get('/sendlist/:curPage', function(req, res, next) {
    // 세션이 존재하는지 확인
    if (req.session.user) {
        // 세션이 존재하는 경우.
        var id = req.session.user.id;
        var name = req.session.user.name;
        
        console.log('id: [%s], name: [%s]', id, name);
        
        var curPage = (req.params.curPage == null ? 1 : req.params.curPage); // 현재페이지
        
        var numPerPage = 1;					// 한 페이지에 보여지는 메일 수
        var totalRecord = 0;			    // 전체 받은 메일 수
        
        var table = 'send_mail';
        var type = 'send_id';                 // (받은(rec_id), 보낸(send_id)) 메일 타입 결정.
                                            // (전체(''))
        mailDB.listMail(id, table, type, function(err, rows) {
            var lists = false;
            if (err) {
                console.log('받은메일 리스트 조회 중 오류 발생: ' + err.stack);
                
                nextStep(lists);
                
                return;
            }

            if (rows) {
                console.dir(rows);
                
                totalRecord = rows.length;
                
                lists = rows;
                
                nextStep(lists);

                return;
            }
            nextStep(lists); 
        });
         
        function nextStep(lists) {
            // 페이지 [이전] 1 [다음] 관련 모듈.
            // 한 페이지에 메일 10개, 5페이지 후 [다음] 활성화
            pageInfo(totalRecord, curPage, numPerPage, 5, function(err, pageData) {
                if (err) {
                    console.log('pageData 받아오기 실패: ' + err.stack);
                    
                    res.render('mailList_send', { title: 'mail', id: id, 
                                        name: name, lists: lists,
                                        curPage: curPage, numPerPage: numPerPage,
                                        totalRecord: totalRecord, 
                                        pageData: false });
                    return;
                }

                if (pageData) {
                    console.dir(pageData);
                    
                    res.render('mailList_send', { title: 'mail', id: id, 
                                        name: name, lists: lists,
                                        curPage: curPage, numPerPage: numPerPage,
                                        totalRecord: totalRecord, 
                                        pageData: pageData });
                    
                    return;
                }
                
                res.render('mailList_send', { title: 'mail', id: id, 
                                        name: name, lists: lists,
                                        curPage: curPage, numPerPage: numPerPage,
                                        totalRecord: totalRecord, 
                                        pageData: false });
            });
        } 
        
        //res.render('mail', { title: 'main', id: id, name: name });
    } else {
        // 세션이 존재하지 않은 경우.
        res.render('login_process', { Message: '로그인이 아직 안되어있습니다.',
                                            result: 'fail' });
    }
});

// 메일 확인(보기) 라우터.
router.get('/mailShow/:mailCode', function(req, res, next) {
    // 세션이 존재하는지 확인
    if (req.session.user) {
        // 세션이 존재하는 경우.
        var id = req.session.user.id;
        var name = req.session.user.name;
        
        console.log('id: [%s], name: [%s]', id, name);
        
        var mail_code = req.params.mailCode;
        var mailType = req.query.type;              // rec 요청 send 요청 구분.
        
        console.log('mailShow - mail_code : ' + mail_code);
        
        // 특정 메일 가져오기.
        mailDB.showMail(mail_code, function(err, rows) {
            var mailData = false;
            if (err) {
                console.log('특정 메일 리스트 조회 중 오류 발생: ' + err.stack);
                
                res.render('mailShow', { title: 'mail', id: id, 
                                        name: name, mailData: mail,
                                        mailType: mailType });
                
                return;
            }

            if (rows) {
                console.dir(rows);
                
                mail = rows;
                
                res.render('mailShow', { title: 'mail', id: id, 
                                        name: name, mailData: mail,
                                        mailType: mailType });
                
                return;
            }
            
            res.render('mailShow', { title: 'mail', id: id, 
                                        name: name, mailData: mail,
                                        mailType: mailType });
        });
        
        //res.render('mail', { title: 'main', id: id, name: name });
    } else {
        // 세션이 존재하지 않은 경우.
        res.render('login_process', { Message: '로그인이 아직 안되어있습니다.',
                                            result: 'fail' });
    }
});

// 메일에 존재하는 첨부파일 다운로드 라우터.
router.get('/mailShow/download/:mailCode', function(req, res, next) {
    // 세션이 존재하는지 확인
    if (req.session.user) {
        // 세션이 존재하는 경우.
        var id = req.session.user.id;
        var name = req.session.user.name;
        
        console.log('id: [%s], name: [%s]', id, name);
        
        var mail_code = req.params.mailCode;
        
        console.log('mailShow/download - mail_code : ' + mail_code);
        
        // 특정 메일 가져오기.
        mailDB.showMail(mail_code, function(err, rows) {
            var mailData = false;
            if (err) {
                console.log('받은메일 리스트 조회 중 오류 발생: ' + err.stack);
                
//                res.render('mail_fileDownload', { title: 'mail', id: id, 
//                                        name: name, mailData: mail });
                
                return;
            }

            if (rows) {
                console.dir(rows);
                
                mail = rows;
                
                var uploadfile = mail[0].uploadfile;
                var uploadfile_origin = mail[0].uploadfile_origin;
                
                var filePath = 'upload/' + uploadfile;
                                    // 다운로드할 파일의 경로 및 저장파일이름.
                
                console.log('다운로드 할 filePath: ' + filePath);

                //var fileName = uploadfile_origin; // 원본파일명
                
                var mimeType = mime.lookup(uploadfile_origin);
                
                console.log('mimeType : ' + mimeType);
                
                // 응답 헤더에 파일의 이름과 mime Type을 명시한다.(한글&특수문자,공백 처리)
                res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(uploadfile_origin));

                res.setHeader("Content-Type", mimeType);

                // filePath에 있는 파일 스트림 객체를 얻어온다.(바이트 알갱이를 읽어옵니다.)
                var fileStream = fs.createReadStream(filePath);

                // 다운로드 한다.(res 객체에 바이트알갱이를 전송한다)
                fileStream.pipe(res);
                
//                res.render('mail_fileDownload', { title: 'mail', id: id, 
//                                        name: name, mailData: mail });
                
                return;
            }
            
//            res.render('mail_fileDownload', { title: 'mail', id: id, 
//                                        name: name, mailData: mail });
        });
        
        //res.render('mail', { title: 'main', id: id, name: name });
    } else {
        // 세션이 존재하지 않은 경우.
        res.render('login_process', { Message: '로그인이 아직 안되어있습니다.',
                                            result: 'fail' });
    }
});

// 메일 쓰기 get 라우터.
router.get('/mail_write', function(req, res, next) {
    // 세션이 존재하는지 확인
    if (req.session.user) {
        // 세션이 존재하는 경우.
        var id = req.session.user.id;
        var name = req.session.user.name;
        
        console.log('id: [%s], name: [%s]', id, name);
        
        var rec_id = '';
        // 받는사람이 존재하는 경우.
        if (req.query.rec_id) {
            rec_id = req.query.rec_id;
        }
        
        console.log('받는 사람 존재? rec_id: ' + rec_id);
    
        userDB.listUser(function(err, rows) {
            if (err) {
                console.log('사용자 리스트 받는 중 오류 발생: ' + err.stack);

                res.render('mail_write', { title: 'mail_write',
                                            Message: '사용자 리스트 받는 중 오류 발생.',
                                            result: false, rec_id: rec_id,
                                            userlist: '' });
                return;
            }

            if (rows) {
                console.dir(rows);

                res.render('mail_write', {title: 'mail_write',
                                            Message: '',
                                            result: true, rec_id: rec_id,
                                            userlist: rows });

                return;
            }

            res.render('mail_write', { title: 'mail_write',
                                        Message: '사용자가 없습니다.',
                                        result: false, rec_id: rec_id,
                                        userlist: '' });
        });
    } else {
        // 세션이 존재하지 않은 경우.
        res.render('login_process', { Message: '로그인이 아직 안되어있습니다.',
                                            result: 'fail' });
    }
    
});

// 메일 쓰기 post 라우터.
router.post('/mail_write', upload.single('uploadfile'), function(req, res, next) {
    try {
//        // 메일 코드 가져오기.
//        var mail_code = mailDB.max_mailCode();
//        
//        if (mail_code) {
//            if (mail_code == 1) {
//                console.log('mail_code: ' + mail_code);
//            } else {
//                mail_code++;
//                console.log('mail_code: ' + mail_code);
//            }
//        } else {
//            console.log('max_mailCode 받는 중 오류 발생');
//            //console.log('max_mailCode 받는 중 오류 발생: ' + err.stack);
//        }
        
        var send_id = req.session.user.id;
        var rec_id = req.body.rec_id || req.query.rec_id;
        var title = req.body.title || req.query.title;
        // 첨부 파일이 있을 시.
        if (req.file) {
            var uploadfile = req.file.filename;
            var uploadfile_origin = req.file.originalname;
            
            console.log(req.file);
            console.log(req.file.originalname);
        } else {
            var uploadfile = '';
            var uploadfile_origin = '';
            
            console.log('첨부파일 없음.');
        }
        
        // 내용 있을 시.
        if (req.body.content || req.query.content) {
            var content = req.body.content || req.query.content;
        } else {
            var content = '';
        }
        
        var send_time = moment().format('YYYY-MM-DD HH:mm:ss a');
                
        console.log('send_time: ' + send_time);
        
        mailDB.sendMail(send_id, rec_id, title, content, send_time, 
                            uploadfile, uploadfile_origin, function(err, result) {
            // 동일한 id로 추가할 때 오류 발생
            if (err) {
                console.log('메일 발송 중 오류 발생: ' + err.stack);

                res.render('mail_write_process', { Message: '메일 발송을 실패했습니다.',
                                                result: false });
                return;
            }

            if (result) {
                console.dir(result);
                res.render('mail_write_process', { Message: '메일 발송 성공했습니다.',
                                                result: true });
                return;
            }
        });
    } catch (err) {
        console.log('에러 발생.');
        console.dir(err.stack);
    }
});

// 메일 삭제 get 라우터.
router.get('/mail_delete/:mailNo', function(req, res, next) {
    // 세션이 존재하는지 확인
    if (req.session.user) {
        // 세션이 존재하는 경우.
        var id = req.session.user.id;
        var name = req.session.user.name;
        
        var mail_code = req.params.mailNo;
        
        var mailType = req.query.type;
        var mailtable = '';
        
        if (mailType == 'rec')
            mailtable = 'rec_mail';
        else
            mailtable = 'send_mail';
        
        
        console.log('id: [%s], name: [%s]', id, name);
        console.log('mailNo : ' + mail_code + ' mailType: ' + mailType);
        
        mailDB.deleteMail(mailtable, mail_code, function(err, result) {
            if (err) {
                console.log('메일 삭제 중 오류 발생: ' + err.stack);

                res.render('mail_delete_process', { title: 'mail_delete',
                                            Message: '메일 삭제 중 오류 발생.',
                                            result: false, mailType: mailType });
                return;
            }

            if (result) {
                console.dir(result);
                console.log('메일 삭제 성공');

                res.render('mail_delete_process', {title: 'mail_delete',
                                            Message: '메일 삭제 성공했습니다.',
                                            result: true, mailType: mailType });

                return;
            }
        });
    } else {
        // 세션이 존재하지 않은 경우.
        res.render('login_process', { Message: '로그인이 아직 안되어있습니다.',
                                            result: 'fail' });
    }
    
});

// 메일 사용자 목록.
router.get('/userlist', function(req, res, next) {
    // 세션이 존재하는지 확인
    if (req.session.user) {
        // 세션이 존재하는 경우.
        var id = req.session.user.id;
        var name = req.session.user.name;
        
        console.log('id: [%s], name: [%s]', id, name);
        
        userDB.listUser(function(err, rows) {
            if (err) {
                console.log('사용자 리스트 받는 중 오류 발생: ' + err.stack);

                res.render('mail_userlist', { title: 'mail_write',
                                            Message: '사용자 리스트 받는 중 오류 발생.',
                                            result: false, userlist: '' });
                return;
            }

            if (rows) {
                console.dir(rows);

                res.render('mail_userlist', {title: 'mail_write',
                                            Message: '',
                                            result: true, userlist: rows });

                return;
            }

            res.render('mail_userlist', { title: 'mail_write',
                                        Message: '사용자가 없습니다.',
                                        result: false, userlist: '' });
        });
    } else {
        // 세션이 존재하지 않은 경우.
        res.render('login_process', { Message: '로그인이 아직 안되어있습니다.',
                                            result: 'fail' });
    }
    
});

module.exports = router;