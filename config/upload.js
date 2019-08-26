// 파일 업로드용 모듈.
var multer = require('multer');
var fs = require('fs');

// multer 미들웨어 사용: 미들웨어 사용 순서 중요 body-parser -> multer -> router.
// 파일 제한: 10개, 1G
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'upload');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname + Date.now());
    }
});

var upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});

module.exports = upload;