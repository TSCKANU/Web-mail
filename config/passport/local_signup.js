var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    passReqToCallback: true
}, function(request, id, password, done) {
    console.log('passport의 local-login 호출됨: ' + id + ', ' + password);
    
    
});