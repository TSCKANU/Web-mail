// mysql 모듈 추출.
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'dnflskfk',
    database: 'test',
    connectionLimit : 10
});

module.exports = pool;