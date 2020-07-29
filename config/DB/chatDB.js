var mysql = require('mysql');
var mysqlDB = require('./mysql-db');

var chatDB = {
    // 채팅 메세지 보내기.(DB에 채팅 저장).
    sendChat: function(send_id, rec_id, content, date, callback) {
        console.log('sendChat 호출.');
        
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
                
                var exec1 = conn.query('select max(chat_code) as chat_code from chat', function(err, rows) {
                        //conn.release();
                    console.log('실행 대상 SQL: ' + exec1.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');

                        console.dir(err);
                        
                        var max_chatCode = null;

                        nextStep(max_chatCode);
                    }

                    if (rows.length > 0) {
                        console.log('max_chatCode 성공.');
                        var max_chatCode = rows[0].chat_code + 1;

                        nextStep(max_chatCode);
                    } else {
                        console.log('max_chatCode가 없습니다.');
                        var max_chatCode = 1;

                        nextStep(max_chatCode);
                    }
                });

                function nextStep(chat_code) {
                        // 데이터를 객체로 만든다.
                    var data = {chat_code:chat_code, send_id:send_id, rec_id:rec_id,                      content:content, date:date };

                    // SQL문 실행.
                    var exec2 = conn.query('insert into chat set ?', data, 
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
                            
                        chat_listTable(chat_code);
                    });
                }
                
                // chat_list 테이블에 넣기.
                function chat_listTable(chat_code) {
                    var exec1 = conn.query('select max(chatlist_code) as chatlist_code from chat_list', function(err, rows) {
                        //conn.release();
                        console.log('실행 대상 SQL: ' + exec1.sql);

                        if (err) {
                            console.log('SQL 실행 시 오류 발생.');

                            console.dir(err);

                            var max_chatlistCode = null;

                            nextStep_list(max_chatlistCode);
                        }

                        if (rows.length > 0) {
                            console.log('max_chatlistCode 성공.');
                            var max_chatlistCode = rows[0].chatlist_code + 1;

                            nextStep_list(max_chatlistCode);
                        } else {
                            console.log('max_chatlistCode가 없습니다.');
                            var max_chatlistCode = 1;

                            nextStep_list(max_chatlistCode);
                        }
                    });
                    
                    function nextStep_list(max_chatlistCode) {
                        var data = { chatlist_code: max_chatlistCode, 
                                            chat_code: chat_code };

                        // SQL문 실행.
                        var exec2 = conn.query('insert into chat_list set ?', data, 
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
                
            });
        } else {
            console.log('풀 실패');
            callback(err, null);
            return;
        }
    },
    
    // 특정 사람의 전체 채팅 리스트 조회. type 1 == send_id, type 2 == rec_id
    listChat: function(id, type, callback) {
        console.log('listChat 호출.');
        
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
                
                var idType = '';
                
                if (type == 1) {
                    idType = 'send_id';
                } else {
                    idType = 'rec_id';
                }
                
                // SQL문 실행.
                var exec = conn.query('select * from chat where ' + idType + ' = ' + id,
                                      function(err, rows) {
                    conn.release();
                    console.log('실행 대상 SQL: ' + exec.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');
                      
                        console.dir(err);

                        callback(err, null);

                        return;
                    }
                    
                    if (rows.length > 0) {
                        console.log('받은(보낸) 채팅 리스트 추출 성공.');
                        callback(null, rows);
                    } else {
                        console.log('받은(보낸) 채팅이 없습니다.');
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
    
    // 특정 사람과의 채팅 리스트 조회.
    listChat: function(send_id, rec_id, callback) {
        console.log('listChat 호출.');
        
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
                var exec = conn.query('select * from chat where send_id = ?' + 
                                        ' and rec_id = ?', function(err, rows) {
                    conn.release();
                    console.log('실행 대상 SQL: ' + exec.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');
                      
                        console.dir(err);

                        callback(err, null);

                        return;
                    }
                    
                    if (rows.length > 0) {
                        console.log('특정 사람과의 채팅 리스트 추출 성공.');
                        callback(null, rows);
                    } else {
                        console.log('특정 사람과의 채팅이 없습니다.');
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
    
    // 채팅 친구 등록.
    add_chatFriend: function(id, friend_id, callback) {
        console.log('add_charFriend 호출.');
        
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
                var exec1 = conn.query('select max(friendlist_code) as friendlist_code from friend_list', function(err, rows) {
                        //conn.release();
                    console.log('실행 대상 SQL: ' + exec1.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');

                        console.dir(err);
                        
                        var max_friendlistCode = null;

                        nextStep(max_friendlistCode);
                    }

                    if (rows.length > 0) {
                        console.log('max_friendlistCode 성공.');
                        var max_friendlistCode = rows[0].friendlist_code + 1;

                        nextStep(max_friendlistCode);
                    } else {
                        console.log('max_friendlistCode가 없습니다.');
                        var max_friendlistCode = 1;

                        nextStep(max_friendlistCode);
                    }
                });

                function nextStep(friendlist_code) {
                        // 데이터를 객체로 만든다.
                    var data = {friendlist_code:friendlist_code, id: id,                                friend_id:friend_id };

                    // SQL문 실행.
                    var exec2 = conn.query('insert into friend_list set ?', data, 
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
            });
        } else {
            console.log('풀 실패');
            callback(err, null);
            return;
        }
    },
    
    // 채팅 친구 조회.
    show_chatFriend: function(id, callback) {
        console.log('show_charFriend 호출.');
        
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
                var exec1 = conn.query('select * from friend_list', function(err, rows) {
                    conn.release();
                    console.log('실행 대상 SQL: ' + exec1.sql);

                    if (err) {
                        console.log('SQL 실행 시 오류 발생.');

                        console.dir(err);
                        
                        callback(err, null);

                        return;
                    }

                    if (rows.length > 0) {
                        console.log('show_chatFriend 성공.');
                        
                        callback(null, rows);
                    } else {
                        console.log('채팅 친구가 없습니다.');
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
    
module.exports = chatDB;