const User = require("../models/user");
const {body,validationResult} = require("express-validator");


exports.task_create_post=[
	body('title',"Title name required").trim().isLength({min:1}).escape(),
	(req,res,next)=>{
		// console.log("task_create_post")
		// console.log("task_create_post body:-",req.body);
		var id=req.cookies.user_id || req.cookies.cookieData.id;
		// var id=req.body.userId
		const errors = validationResult(req);
		// console.log(req.body.title)
		var task={
			title:req.body.title
		}
		User.findByIdAndUpdate(id,{$push: { tasks: task }}).exec(function(err,user){
			if(err) throw err;
			console.log(user);
			res.redirect("/task/create")
			// res.json(user);
		})
		
	}
]

exports.task_list = function(req,res){
	// console.log("csrf at task_list:--->>>",req.cookies.csrfToken);
	console.log("params:",req.params);
	// var id=req.params.id;
	var id=req.cookies.user_id || req.cookies.cookieData.id;
	User.findById(id).exec(function(err,results){
		if(err) throw err;
		// res.json(results);
		console.log("RESult:::",results)
		res.render("home",{data:results.tasks,csrfToken:req.cookies.csrfToken})
	})
}

exports.task_delete=(req,res)=>{
	// console.log("Parameter :",req.params);
	// var userId=req.params.userId;
	var taskId = req.params.taskId;
	var id=req.cookies.user_id || req.cookies.cookieData.id;

	// console.log("Task Id:",taskId);
	User.findOne({_id:id}).then(function(user){
		console.log("User find:",user);
		user.tasks.pull(taskId);
		console.log("user afetr:",user);
		user.save().then(function(user){
			res.json(user);
		})
	})
	
}

exports.removeAll = function(req,res){
	// var id=req.params.id;
	var id=req.cookies.user_id || req.cookies.cookieData.id;

	// console.log("removeAll api");
	// console.log("CookieData Id:",req.cookies.cookieData.id)
	User.findByIdAndUpdate(id,{tasks:[]}).exec(function(err,results){
		if(err) throw err;
		console.log("okk jao")
		res.json(results)
	})
}