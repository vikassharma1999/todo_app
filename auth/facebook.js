var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require("../models/user");
console.log("1")
passport.use(new FacebookStrategy({
	clientID:"465015681573950",
	clientSecret:"d7abe6b944537726894dc38521d406e4",
	callbackURL:"https://stark-oasis-18698.herokuapp.com/auth/facebook/callback"
	// callbackURL:"http://localhost:4000/auth/facebook/callback"
	},

	function(accessToken, refreshToken, profile, done){
		console.log("Profile Data:",profile)
		User.findOrCreate({userid:profile.id},{name:profile.displayName,userid:profile.id},function(err,user){
			if(err){
				return done(err);
			}
			// res.send("success...")
			console.log("USER:",user.doc.id)
			// res.cookie("user_id",user.doc.id,{expire: new Date()+9999})
			return done(null,user);
		})
		// console.log(accessToken)
	}
));
module.exports = passport;
