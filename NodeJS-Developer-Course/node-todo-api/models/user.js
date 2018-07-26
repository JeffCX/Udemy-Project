const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const _ = require("lodash")
const bcrypt = require("bcryptjs")

// add Schema to add new methods
var UserSchema = new mongoose.Schema({
	email:{
		type:String,
		required:true,
		trim:true,
		minlength:1,
		unqiue:true,
		validate:{
			validator:validator.isEmail,
			message:"{value} is not an valid email"
		},
	},
		password:{
			type:String,
			require:true,
			minlength:6,
		},

		tokens:[
			{
				access:{
					type:String,
					required:true
				},
				token:{
					type:String,
					required:true
				}
			}
		]
	
})


//control which data you send back to user
UserSchema.methods.toJSON = function(){
	//control the method you send back
	var user = this
	var userObject = user.toObject()
	return _.pick(userObject,["_id","email"])
}


//generate a token
UserSchema.methods.generateAuthToken = function(){
	var user = this
	var access = "auth"

	var token =jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString()
	console.log(token)
	user.tokens = [{access,token}]
	




	return user.save().then(()=>{
		return token;
	})
}

UserSchema.statics.findByToken = function(token){
	var User = this;
	var decoded = undefined;

	try{
		decoded = jwt.verify(token,process.env.JWT_SECRET)
	}catch(e){
		return Promise.reject("invalid token")
	}
	console.log(decoded)
	
	
	return User.findOne({
		"tokens.token":token,
	
	})
}


UserSchema.pre("save",function(text){
	user = this
	if (user.isModified("")){
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(user.password,salt,(err,hash)=>{
				user.password = hash
			})
			next()
		})
	
	}else{
		next()
	}
})

UserSchema.statics.findByCredentials = function(email,password){
	var user = this
	return User.findOne({email}).then((user)=>{
		if(!user){
			return Promise.reject()
		}

		return new Promise((resolve,reject)=>{bcrypt.compare(password,user.password,(err,result)=>{
			if(err){
				reject()
			}else{
				resolve(user)
			}
		})})
	})

	return new Promise()
}

UserSchem.methods.removeToken = function(token){
	var user = this
	return user.update({
		$pull:{
			tokens:{
				token
			}
		}
	})
}

var User = mongoose.model("Users",UserSchema)

module.exports.User = User