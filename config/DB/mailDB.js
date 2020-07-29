var mysql = require('mysql');
var mysqlDB = require('./mysql-db');

var mailDB = {
//    // 메일 코드 max 숫자 가져오기.
//    max_mailCode: function() {
//        console.log('max_mailCode 호출.');
//        
//        if (mysqlDB) {
//            console.log('풀 성공');
//            // 커넥션 풀에서 연결 객체 가져옴.
//            mysqlDB.getConnection(function(err, conn) {
//                if (err) {
//                    console.log(err);
//                    console.log('커넥션 실패');
//                    if (conn) {
//                        conn.release();     // 반드시 해제.
//                    }
//
//                    //callback(err, null);
//                    return null;
//                }
//                console.log('DB 연결 스레드 아이디: ' + conn.threadId);
//
//                // SQL문 실행.
//                var exec = conn.query('select max(mail_code) as mail_code from mail', 
//                                                        function(err, rows) {
//                    conn.release();
//                    console.log('실행 대상 SQL: ' + exec.sql);
//
//                    if (err) {
//                        console.log('SQL 실행 시 오류 발생.');
//                      
//                        console.dir(err);
//
//                        //callback(err, null);
//
//                        return null;
//                    }
//                    
//                    if (rows.length > 0) {
//                        console.log('max_mailCode 성공.');
//                        return rows[0].mail_code;
//                        //callback(null, rows);
//                    } else {
//                        console.log('max_mailCode가 없습니다.');
//                        return 1;
//                        //callback(null, null);
//                    }
//                });
//            });
//        } else {
//            console.log('풀 실패');
//            //callback(err, null);
//            return null;
//        }
//    },
    // 메일 보내기(DB에 메일 저장).
    sendMail: function(send_id, rec_id, title, content, send_time, 
                        uploadfile, uploadfile_origin, callback) {
        console.log('sendMail 호출.');
        
        if (mysqlDB) {
            console.log('풀 성공');
            // 커넥션 풀에서 연결 객체 가져옴.
            mysqlDB.getConnection(function(err, conn) {
                if (err) {
                    console.log(err);
                    console.log('커넥션 실패');
                    if (conn) {
                        conn.release();     // 반드시 해제.
                    }

                    callback(err, null);
                    return;
                }
                console.log('DB 연결 스레드 아이디: ' + conn.threadId);
                
                // type == 1 -> send_mail , type == 2 -> rec_mail 추가.
                function step1(type) {
                    var exec1 = conn.query('select max(mail_code) as mail_code from mail', function(err, rows) {
                        //conn.release();
                        console.log('실행 대상 SQL: ' + exec1.sql);

                        if (err) {
                            console.log('SQL 실행 시 오류 발생.');

                            console.dir(err);

                            var max_mailCode = null;

                            nextStep_step1(max_mailCode);
                        }

                        if (rows.length > 0) {
                            console.log('max_mailCode 성공.');
                            var max_mailCode = rows[0].mail_code + 1;

                            nextStep_step1(max_mailCode);
                        } else {
                            console.log('max_mailCode가 없습니다.');
                            var max_mailCode = 1;

                            nextStep_step1(max_mailCode);
                        }
                    });

                    function nextStep_step1(mail_code) {
                        // 데이터를 객체로 만든다.
                        var data = {mail_code:mail_code, send_id:send_id, rec_id:rec_id,                        title:title, content:content, send_time:send_time,
                                            uploadfile:uploadfile, 
                                            uploadfile_origin:uploadfile_origin };

                        // SQL문 실행.
                        var exec2 = conn.query('insert into mail set ?', data, 
                                                        function(err, result) {
                            //conn.release();
                            console.log('실행 대상 SQL: ' + exec2.sql);

                            if (err) {
                                console.log('SQL 실행 시 오류 발생.');

                                console.dir(err);

                                callback(err, null);

                                return;
                            }

                            //callback(null, result);
                            
                            if (type == 1) {
                                send_mailtable(mail_code);
                            } else{
                                rec_mailtable(mail_code);
                            }
                        });
                    }
                }
                
                // send_mail 테이블에 넣기.
                function send_mailtable(mail_code) {
                    var exec1 = conn.query('select max(sendmail_code) as sendmail_code from send_mail', function(err, rows) {
                        //conn.release();
                        console.log('실행 대상 SQL: ' + exec1.sql);

                        if (err) {
                            console.log('SQL 실행 시 오류 발생.');

                            console.dir(err);

                            var max_sendmailCode = null;

                            nextStep_send(max_sendmailCode);
                        }

                        if (rows.length > 0) {
                            console.log('max_sendmailCode 성공.');
                            var max_sendmailCode = rows[0].sendmail_code + 1;

                            nextStep_send(max_sendmailCode);
                        } else {
                            console.log('max_sendmailCode가 없습니다.');
                            var max_sendmailCode = 1;

                            nextStep_send(max_sendmailCode);
                        }
                    });
                    
                    function nextStep_send(max_sendmailCode) {
                        var data = { sendmail_code: max_sendmailCode, 
                                            mail_code: mail_code };

                        // SQL문 실행.
                        var exec2 = conn.query('insert into send_mail set ?', data, 
                                                        function(err, result) {
                                //conn.release();
                                console.log('실행 대상 SQL: ' + exec2.sql);

                                if (err) {
                                    console.log('SQL 실행 시 오류 발생.');

                                    console.dir(err);

                                    callback(err, null);

                                    return;
                                }

                                //callback(null, result);
                            
                                step1(2);
                        });
                    }
                }
                
                // rec_mail 테이블에 넣기.
                function rec_mailtable(mail_code) {
                    var exec1 = conn.query('select max(recmail_code) as recmail_code from rec_mail', function(err, rows) {
                        //conn.release();
                        console.log('실행 대상 SQL: ' + exec1.sql);

                        if (err) {
                            console.log('SQL 실행 시 오류 발생.');

                            console.dir(err);

                            var max_recmailCode = null;

                            nextStep_rec(max_recmailCode);
                        }

                        if (rows.length > 0) {
                            console.log('max_recmailCode 성공.');
                            var max_recmailCode = rows[0].recmail_code + 1;

                            nextStep_rec(max_recmailCode);
                        } else {
                            console.log('max_recmailCode가 없습니다.');
                            var max_recmailCode = 1;

                            nextStep_rec(max_recmailCode);
                        }
                    });
                    
                    function nextStep_rec(max_recmailCode) {
                        var data = { recmail_code: max_recmailCode, 
                                            mail_code: mail_code };

                        // SQL문 실행.
                        var exec2 = conn.query('insert into rec_mail set ?', data, 
                                                        function(err, result) {
                                conn.release();
                                console.log('실행 대상 SQL: ' + exec2.sql);

                                if (err) {
                                    console.log('SQL 실행 시 오류 발생.');

                                    console.dir(err);

                                    callback(err, null);

                                    return;
                                }

                                callback(null, result);
                        });
                    }
                }
                
                step1(1);
            });
        } else {
            console.log('풀 실패');
            callback(err, null);
            return;
        }
    },
    // 받은 메일 리스트 조회.
    listMail: function(id, table, type, callback) {
        console.log('reclistMail 호출.');
        
        if (mysqlDB) {
            console.log('풀 성공');
            // 커넥션 풀에서 연결 객체 가져옴.
            mysqlDB.getConnection(function(err, conn) {
                if (err) {
                    console.log(err);
                    console.log('커넥션 실패');
                    if (conn) {
                        conn.release();     // 반드시 해제.
                    }

                    callback(err, null);
                    return;
                }
                console.log('DB 연결 스레드 아이디: ' + conn.threadId);
                
                // SQL문 실행.
                var exec = conn.query('select * from mail as m, ' + table + ' as s where m.mail_code = s.mail_code and ' + type + ' = ? order by m.send_time desc', [id], function(err, rows) {
                    conn.release();
                    console.log('실행 대상 SQL: ' + exec.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');
                      
                        console.dir(err);

                        callback(err, null);

                        return;
                    }
                    
                    if (rows.length > 0) {
                        console.log('받은(보낸) 메일 리스트 추출 성공.');
                        callback(null, rows);
                    } else {
                        console.log('받은(보낸) 메일이 없습니다.');
                        callback(null, null);
                    }
                });
            });
        } else {
            console.log('풀 실패');
            callback(err, null);
            return;
        }
    },
    // 특정 메일 가져오기.
    showMail: function(mail_code, callback) {
        console.log('showMail 호출.');
        
        if (mysqlDB) {
            console.log('풀 성공');
            // 커넥션 풀에서 연결 객체 가져옴.
            mysqlDB.getConnection(function(err, conn) {
                if (err) {
                    console.log(err);
                    console.log('커넥션 실패');
                    if (conn) {
                        conn.release();     // 반드시 해제.
                    }

                    callback(err, null);
                    return;
                }
                console.log('DB 연결 스레드 아이디: ' + conn.threadId);

                // SQL문 실행.
                var exec = conn.query('select * from mail where mail_code = ?', [mail_code], function(err, rows) {
                    conn.release();
                    console.log('실행 대상 SQL: ' + exec.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');
                      
                        console.dir(err);

                        callback(err, null);

                        return;
                    }
                    
                    if (rows.length > 0) {
                        console.log('특정 메일(showMail) 리스트 추출 성공.');
                        callback(null, rows);
                    } else {
                        console.log('특정 메일(showMail)이 없습니다.');
                        callback(null, null);
                    }
                });
            });
        } else {
            console.log('풀 실패');
            callback(err, null);
            return;
        }
    },
    // 메일 삭제 함수.
    deleteMail: function(mailtable, mail_code, callback) {
        console.log('addUser 호출.');
        
        if (mysqlDB) {
            console.log('풀 성공');
            // 커넥션 풀에서 연결 객체 가져옴.
            mysqlDB.getConnection(function(err, conn) {
                if (err) {
                    console.log(err);
                    console.log('커넥션 실패');
                    if (conn) {
                        conn.release();     // 반드시 해제.
                    }

                    callback(err, null);
                    return;
                }
                console.log('DB 연결 스레드 아이디: ' + conn.threadId);
               
                // SQL문 실행.
                var exec = conn.query('delete from ' + mailtable + 
                        ' where mail_code =  ?', [mail_code], function(err, result) {
                    conn.release();
                    console.log('실행 대상 SQL: ' + exec.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');
                      
                        console.dir(err);

                        callback(err, null);

                        return;
                    }

                    callback(null, result);
                });
            });
        } else {
            console.log('풀 실패');
            callback(err, null);
            return;
        }
    }
}
    
module.exports = mailDB;