// 기본 모듈 추출
var http = require('http');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');

// 라우터 모듈 추출.
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var mainRouter = require('./routes/main');
var logoutRouter = require('./routes/logout');
var mailRouter = require('./routes/mail');
var socketio = require('socket.io');


// mysql 모듈
var mysql = require('mysql');

// mysql 모듈 추출.
var mysql = require('mysql');
var mysqlDB = require('./config/DB/mysql-db');

/* 패스포트 부분. 
// passport 사용
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');   // 플래시 메시지 사용.
*/

// 파일 업로드용 모듈.
var multer = require('multer');
var fs = require('fs');

// cors 사용 - 클라이언트에서 ajax로 요청하면 CORS 지원
var cors = require('cors');

// 서버 생성.
var app = express();

//app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* middleware setup */
// URL 요청 시 대소문자 구분.
app.set('case sensitive routes', true);

// cors를 미들웨어로 사용하도록 등록
//app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
// 업로드 폴더 오픈.
app.use('upload', express.static(path.join(__dirname, 'upload')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/main', mainRouter);
app.use('/logout', logoutRouter);
app.use('/mail', mailRouter);

/* 패스 포트 부분. 
// passport 사용 설정.
app.use(passport.initialize()); // 초기화
app.use(passport.session());    // 로그인 세션 유지
app.use(flash());               // 

// 패스 포트 로그인 설정
passport.use('local-login', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    passReqToCallback: true
}, function(request, id, password, done) {
    console.log('passport의 local-login 호출됨: ' + id + ', ' + password);
    
    // 커넥션 풀에서 연결 객체를 가져온다.
    pool.getConnection(function(err, conn) {
        // 연결 에러가 난다면,
        if (err) {
            if (conn) {
                conn.release(); // 반드시 해제.
            }
            
            callback(err, null);
            return;
        }
        
        console.log('데이터베이스 연결 스레드 아이디: ' + conn.threadId);
        
        var colums = 'id';
        var tablename = 'user';
        
        // SQL문 실행.
        var exec = conn.query("select * from ?? where id = ?", [colums, tablename, id],                             function(err, rows) {
            
            conn.release();     // 반드시 해제.
            console.log('실행 대상 SQL: ' + exec.sql);
            
            if (err) {return done(err);}
            
            // 등록된 사용자가 없는 경우.
            if (!(rows.length > 0)) {
                console.log('계정이 일치하지 않음.');
                return done(null, false, 
                            request.flash('loginMessage', '등록된 계정이 없습니다.'));
            }
        });
    });
    
    connection.connect();

    connection.query('SELECT * from Persons', function(err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.', err);
    });

    connection.end();
    
}));
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = http.createServer(app).listen(3000, function() {
    console.log('서버가 시작되었습니다. 포트: 3000');
});

var io = socketio.listen(server);
io.sockets.on('connection', function (socket){
    console.log('Socket ID : ' + socket.id + ', Connect');
    socket.on('clientMessage', function(data){
        //console.log('Client Message : ' + data);
         
        var message = {
            msg : 'server',
            data : 'data'
        };
        socket.emit('serverMessage', message);
    });
});

/*
// 소켓 서버를 생성합니다.
var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    var roomId = "";

    socket.on('join', function (data) {
        socket.join(data);
        roomId = data;
    });
    socket.on('draw', function (data) {
        (io.sockets.in(roomId).emit('line', data));
    });
    socket.on('create_room', function (data) {
        io.sockets.emit('create_room', data.toString());
    });
});
*/

//app.io.on('connection', function(socket){    
//    console.log('socketio user connected...');
//    console.log('Socket ID : ' + socket.id + ', Connect');
//    console.log('소켓을 사용할 준비가 되었습니다.');
//    
//    socket.on('admin', function (data) {
//        console.log('Successful Socket Test');
//        console.log('data: ' + data);
//    });
//});

module.exports = app;