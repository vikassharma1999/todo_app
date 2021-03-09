const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name:{
		type:String,
		// required:true
	},
	userid:{
		type:String
	},
	email:{
		type:String,
		// required:true
	},
	password:{
		type:String,
		// required:true
	},
	tasks:[
		{
			title:{
				type:String
			}
		}
	],
	token:{
		type:String,
	}
});

UserSchema.statics.findOrCreate = require("find-or-create");
const User = mongoose.model("User",UserSchema);
module.exports = User;