//this file is used with sequelize

const express = require("express");
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const Task = require("../models/Task");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const Sequelize=require('sequelize')


router.get("/clearAll",(req,res)=>{
	var id=req.cookies.user_id || req.cookies.cookieData.id;
	console.log("Id",id)
	Task.findByPk(id).then(user=>{
		console.log("user find",user.tasks)
		user.update({
			tasks:null
		}).then(()=>res.redirect("/seq/task/allTask")).catch(err=>console.log(err))
	})
})

router.post("/delete/:task_id",(req,res)=>{
	var id=req.cookies.user_id || req.cookies.cookieData.id;
	console.log(id)
	console.log(req.params.task_id);
	Task.findByPk(id).then(user=>{
		console.log("Before:",user.tasks)
		var idx=0;
		for(var i=0;i<user.tasks.length;i++){
			if(user.tasks[i].task_id==req.params.task_id){
				idx=i;
				break;
			}
		}
		// user.tasks.splice(idx,1);
		console.log("After:",user.tasks)
		// console.log(user.tasks)
		user.update({
			tasks:Sequelize.fn('array_remove',Sequelize.col('tasks'),JSON.stringify(user.tasks[i]))
		}).then((user1)=>{
			console.log("After deleting:",user1.tasks);
			res.redirect("/seq/task/allTask")
		})
	})
	// res.send("ohhh")
})
router.get("/allTask",(req,res)=>{
	var id=req.cookies.user_id || req.cookies.cookieData.id;
	console.log(id);
	Task.findByPk(id)
		.then(user=>{
			console.log("All tasks",user.tasks)
			res.render('home',{data:user.tasks})
		})
		.catch(err=>console.log(err))

})

router.post("/addTask",(req,res)=>{
	console.log("body: ",req.body)
	var id=req.cookies.user_id || req.cookies.cookieData.id;
	Task.findByPk(id)
		.then(user=>{
			if(user.dataValues.tasks==null){
				console.log("yes")
				user.update({
				tasks:[
					{
						task_id:uuidv4(),
						title:req.body.title
					}
				]

			})
			.then(user=>{
				res.redirect("/seq/task/allTask")
			})
			.catch(err=>{
				console.log("not going")
				console.log(err)
			})
			}
			else{
				// console.log(user.dataValues.tasks.push(req.body));
				const val={title:req.body.title,task_id:uuidv4()}
				// console.log("before:",user.tasks)
				// user.tasks.push(val);
				// console.log("after",user.tasks)
				user.update({
					tasks: Sequelize.fn('array_append', Sequelize.col('tasks'), JSON.stringify(val))
				}).then(user=>{
					console.log("yesssss",user.tasks)
					res.redirect("/seq/task/allTask");
				}).catch(err=>{
					console.log("nahha")
					console.log(err)
				})
				}
			
		})
		.catch(err=>console.log(err));
})

//post api for signup
router.post("/signup",(req,res)=>{
	let {name,email,password}=req.body;
	console.log(name,email,password)
	bcrypt.hash(password,10).then(hash=>{
		Task.findOne({where:{email:email}})
			.then((user)=>{
				if(user){
					res.send("User already exists...")
				}
				else{
					Task.create({
						name:name,
						email:email,
						password:hash
					}).then(user=>{
						console.log(user);
						res.redirect("/seq/task/login");
					}).catch(err=>console.log(err));
				}
			})
			.catch(err=>console.log(err))
	})
	.catch(err=>console.log(err));

})

router.get("/signup",(req,res)=>{
	res.render("signup",{errors:"no"});
})
router.get("/login",(req,res)=>{
	res.render("login",{errors:"no"});
})


//post api for login
router.post("/login",(req,res)=>{
	let {email,password} = req.body;
	Task.findOne({where:{email:email}})
			.then(user=>{
				if(!user){
					res.send("No user found with this email id.")
				}
				else{
					bcrypt.compare(password,user.password)
							.then(result=>{
								if(!result){
									res.send("password incorrect")
								}
								else{
									const token=jwt.sign({id:user.id,tokenId:uuidv4()},"vikassharma");
									var cookieData = {
											token:token,
											id:user.id
										}
									res.cookie("cookieData",cookieData,{expire: new Date()+9999})
									user.update({
										token:token
									}).then(()=>{
										res.redirect("/seq/task/allTask")
									})
								}
							})

				}
			})
			.catch(err=>console.log(err));
})


router.get("/logout",(req,res)=>{
	// console.log("clear")
	res.clearCookie("cookieData");
	res.clearCookie("user_id")
	// req.logout();
	res.redirect("/seq/task/login")
})
module.exports = router;