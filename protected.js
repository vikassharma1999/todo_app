//middleware to check if user is Authenticated or not
const User = require("./models/user");
exports.isSignedIn = (req,res,next)=>{
	// console.log(req.headers.cookie)
	var d=new Date();
	// console.log("SESSION:",d.getTime())
	// console.log("session time:",req.session.cookie._expires.getTime())
	// console.log(req.isAuthenticated())
	// console.log("Header cookie",req.headers.cookie.Created)
	// console.log("cookies:",req.cookies)
	if(req.isAuthenticated()){
		next();
		return;
	}
	else if(req.cookies.cookieData){
		const tokenFromCookie = req.cookies.cookieData.token;
		const userId = req.cookies.cookieData.id;
		User.findById(userId).exec(function(err,user){
		if(err) throw err;
		// console.log(user.token==tokenFromCookie)
		if(user.token == tokenFromCookie){
			// res.clearCookie("cookieData");
			// console.log("User token:",user.token)
			next();
			return;
		}
		else{
			res.redirect("/auth/login")
			return;
		}
	})
		return;
}

	res.redirect("/auth/login")
}
