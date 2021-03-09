const Sequelize = require('sequelize');
const db = new Sequelize('todo','postgres','vs867312@',{
	host:'localhost',
	dialect:'postgres',
	pool:{
		max:5,
		min:0,
		acquire:30000,
		idle:10000
	},
})

module.exports = db;