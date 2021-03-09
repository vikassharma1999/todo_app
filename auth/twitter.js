var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

passport.serializeUser(function (user, fn) {
  fn(null, user);
});

passport.deserializeUser(function (id, fn) {
  User.findOne({_id: id.doc._id}, function (err, user) {
    fn(err, user);
  });
});

passport.use(new TwitterStrategy({
    consumerKey: "HQt3BIhTBKFQ7mAHSJlpwQtLP",
    consumerSecret: "LoBoakLWwtfemqIj24cu0HViOyC6jKJ5b97mZWRcx45KhXZaTc",
    callbackURL: "https://stark-oasis-18698.herokuapp.com/auth/twitter/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("Profile:",profile)
    User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }
      console.log("User: ",user.doc._id)
      done(null, user);
    });
  }
));

module.exports = passport;

//602215959b76a7149c34081a
