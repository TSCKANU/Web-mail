var mysql = require('mysql');
var mysqlDB = require('./mysql-db');

var userDB = {
    // 사용자 인증 함수.
    authUser: function(id, password, callback) {
        console.log('authUser 호출.');
        
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

                // 데이터를 객체로 만든다.
                //var columns = [ 'id', 'password'];
                //var tablename = 'user';

                // SQL문 실행.
                var exec = conn.query('select * from user where id = ? and password = ?',              [id, password], function(err, rows) {
                    // 반드시 해제.
                    conn.release();
                    
                    console.log('실행 대상 SQL: ' + exec.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');
                        console.dir(err);

                        callback(err, null);

                        return;
                    }
                    
                    if (rows.length > 0) {
                        console.log('아이디 [%s], 패스워드 [%s]가 일치하는 사용자 찾음.', 
                                                            id, password);
                        callback(null, rows);
                    } else {
                        console.log('일치하는 사용자를 찾지 못함.');
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
    // 사용자 추가 함수.
    addUser: function(id, password, name, phone, birth_date, callback) {
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
                
                // 이메일 자동 생성.
                var email = id + '@localmail.com';
                
                // 데이터를 객체로 만든다.
                var data = {id:id, password:password, name:name,
                                    phone:phone, birth_date:birth_date,
                                    email: email };

                // SQL문 실행.
                var exec = conn.query('insert into user set ?', data, function(err, result) {
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
    },
    // 모든 사용자 불러오기.
    listUser: function(callback) {
        console.log('listUser 호출.');
        
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
                var exec = conn.query('select id from user', function(err, rows) {
                    conn.release();
                    console.log('실행 대상 SQL: ' + exec.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');
                      
                        console.dir(err);

                        callback(err, null);

                        return;
                    }
                    
                    if (rows.length > 0) {
                        console.log('사용자 리스트 추출 성공.');
                        callback(null, rows);
                    } else {
                        console.log('사용자가 없습니다.');
                        callback(null, null);
                    }
                });
            });
        } else {
            console.log('풀 실패');
            callback(err, null);
            return;
        }
    }
}
    
module.exports = userDB;