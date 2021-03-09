const express = require("express");
const {body,validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const router = express.Router();
var passportGoogle = require('../auth/google');
var passportTwitter = require('../auth/twitter');
var passportFacebook = require('../auth/facebook');
router.get("/login",(req,res)=>{
	// console.log("CSRF__TOKEN:: ",req.body);
	console.log("cookie at login:",req.cookies.csrfToken)
	res.render("login",{errors:"no",csrfToken:req.cookies.csrfToken});
})






/* FACEBOOK ROUTER */
router.get('/facebook',
  passportFacebook.authenticate('facebook'));

router.get('/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("REQ:",req.user.doc)
    res.cookie("user_id",req.user.doc._id,{expire: new Date()+9999})
    res.redirect("/task/create")//use without connecting this to fronend.use with ejs only 
    // res.json(req.user.doc)//use if want to connect this app with frontend(react)
  });

/* GOOGLE ROUTER */
router.get('/google',
  passportGoogle.authenticate('google', { scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile' }));

router.get('/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
  	console.log("REQ:",req.user.doc._id)
    res.cookie("user_id",req.user.doc._id,{expire: new Date()+9999})
    res.redirect("/task/create")
  });

/* TWITTER ROUTER */
router.get('/twitter',
  passportTwitter.authenticate('twitter'));

router.get('/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("REQ:",req.user.doc._id)
    res.cookie("user_id",req.user.doc._id,{expire: new Date()+9999})
    res.redirect("/task/create")
  });

router.get("/signup",(req,res)=>{
	res.render("signup",{errors:"no",csrfToken:req.cookies.csrfToken});
})

router.post("/login",(req,res)=>{
	const {email,password}=req.body
	
	// console.log("BODY:::",req.body)
	// console.log(email,password)
	User.findOne({email},(err,user)=>{
		if(err) throw err;
		if(!user || user.password==undefined){
			res.render("login",{errors:"user not found",csrfToken:req.cookies.csrfToken})
			// res.json({error:"user not found"})
			return;
		}
		bcrypt.compare(password,user.password).then((result)=>{
			if(!result){
				// res.json({error:"password incorrect!!!"})
				res.render("login",{errors:"password incorrect!!!",csrfToken:req.cookies.csrfToken})
				return;
			}
			const token=jwt.sign({_id:user._id,tokenId:uuidv4()},"vikassharma");
			var cookieData = {
				token:token,
				id:user._id
			}
			res.cookie("cookieData",cookieData,{expire: new Date()+9999})

			User.findByIdAndUpdate(user._id,{token:token}).exec(function(err,results){
				if(err) throw err;
				res.redirect("/task/create")
				// console.log("idr user:",user)
				// const {_id,name,email}=user;
				// return res.json({token,user:{_id,name,email}});//use this if want to connect this with frontend
				})

			
		})
		// console.log(user);
	})

})

router.post("/signup",[
		body('name',"Name is required").trim().isLength({min:1}).escape(),
		body('email',"Email is required").escape(),
		body('password').isLength({min:5}).withMessage("min 5 char password is required")
	],
	(req,res)=>{
	const {name,email,password} = req.body;
	const errors  = validationResult(req)
	// console.log(errors.array()[0].msg)
	if(!errors.isEmpty()){
		// res.json({error:errors.array()[0]})
		res.render('signup',{errors:errors.array(),csrfToken:req.cookies.csrfToken})
		return;
	}
	var newUser = new User({
		name:name,
		email:email,
		password:password
	})

	bcrypt.hash(password,10).then((hash)=>{
		newUser.password=hash
		User.findOne({email},(err,user)=>{
			if(err) throw err;
			if(user){
				res.render('signup',{errors:[{msg:"User already exists"}],csrfToken:req.cookies.csrfToken})
				// res.json({error:"User already exists"})
				return;
			}
			newUser.save((err,user)=>{
				if(err) throw err;
				res.redirect("/auth/login");
				console.log("USer inside backend:",user)
				// res.json({
				// 	name:user.name,
				// 	email:user.email,
				// 	id:user._id
				// })
			})
		})
	})

	// console.log(newUser)



})

router.get("/logout",(req,res)=>{
	// console.log("clear")
	res.clearCookie("cookieData");
	res.clearCookie("user_id")
	req.logout();
	res.redirect("/auth/login")
	// res.json({
	// 	message:"user signout success..."
	// })
})


// router.get("/checkforlogin/:id",(req,res)=>{
// 	console.log("aaya idr b")
// 	const userId = req.params.id;
// 	User.findById(userId).exec((err,user)=>{
// 		if(err) throw err;
// 		if(user){
// 			console.log("user:-->",user)
// 			return res.json({tokenFromDb:user.token})
// 		}
// 		return res.json({error:"No token found"})
// 	})
// })
// router.get("/logoutwith",(req,res)=>{
// 	console.log(uuidv4());
// 	console.log("hello");
// 	res.send(uuidv4());
// })
module.exports = router;

