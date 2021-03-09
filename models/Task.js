//for sequelize version

const Sequelize = require("sequelize");
const db = require("../config/database");

const Task = db.define('task',{
	name:{
		type:Sequelize.STRING
	},
	userid:{
		type:Sequelize.STRING
	},
	email:{
		type:Sequelize.STRING
	},
	password:{
		type:Sequelize.STRING
	},
	token:{
		type:Sequelize.STRING
	},
	tasks:[
		{	
			task_id:{
				type:Sequelize.STRING
			},

			title:{
				type:Sequelize.STRING
			}
		}
	]
})

module.exports = Task