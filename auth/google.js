var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: "229720970265-1bd3t6n8jqfku0m07193s597n8pkmgur.apps.googleusercontent.com",
    clientSecret: "xtPwOHx_lgycDMTN3mkkYlUv",
    callbackURL: "https://stark-oasis-18698.herokuapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("Profile: ",profile);
       User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id,email:profile.emails[0].value }, function (err, user) {
		// console.log("User Details: ",user.doc._id);       	
         return done(err, user);
       });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;