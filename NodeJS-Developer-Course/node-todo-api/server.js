var env = process.env.NODE_ENV || "development" // can be development ,production ,test
if(env=="development"){
	process.env.PORT=3000
		process.env.MONGODB_URI="mongodb://localhost:27017/TodoApp"
}else if(env=="test"){
	process.env.PORT=3000
		process.env.MONGODB_URI="mongodb://localhost:27017/TodoAppTest"
}
const _ = require("lodash")
var express = require("express")
var bodyParser = require("body-parser")
var {mongoose} =require("./db/mongoose")
var {Todo} = require("./models/todo")
var {User} = require("./models/user")
var {ObjectID} = require("mongodb")
var  bcrypt = require("bcryptjs")

var port = process.env.PORT || 3000
var app = express()
app.use(bodyParser.json()) //send json to our express apllication

console.log("gan")
app.post("/todos",authenticate,(req,res)=>{
	var todo = new Todo({
		text:req.body.text,
		_creator:req.user._id
	})
	console.log(todo)
	todo.save().then((doc)=>{
		res.send(doc)
	},(e)=>{
		res.send(e)
	})
})

app.get("/todos",authenticate,(req,res)=>{
	Todo.find({_creator:req.user._id}).then((todos)=>
	{
		res.send({todos})
	}).catch((e)=>{
		res.status(400).send(e)
	})
})

app.get("/todos/:id",authenticate,(req,res)=>{
	var id = req.params.id
	console.log(typeof(id))
	if(!ObjectID.isValid(id)){
		res.status(404).send({error:"404 id is not valid"})
	}else{
		Todo.findOne(
			{_id:id,
			_creator:req.user._id
			}
		).then((data)=>{
			if(!data)
			{
				res.status(400).send({error:"400 id is not found"})
			}else{
				res.status(200).send({data})
			}
		}).catch((e)=>{
			res.status(400).send({error:"400 id is not found"})
		})
	}
})

app.patch("/todos/:id",(req,authenticate,res)=>{
	var id = req.params.id
	var body = _.pick(req.body,["text","completed"])

	if(ObjectID.isValid(id)){
		return res.status(404).send()
	}

	if(_.isBoolean(body.completed)&&body.completed){
		body.completed = new Date().getTime()
	}else{
		body.completed = false
		body.completedAt = null
	}

	Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
		if(!todo){
			return res.status(404).send()
		}
		res.status(200).send({todo})
	})
})

//5b2583434b5b9728143a5f8f"
app.delete("/todos/:id",authenticate,(req,res)=>{
	console.log("deleting")
	var id = req.params.id
	if(!ObjectID.isValid(id)){
		res.status(404).send()
	}

	Todo.findByOneAndRemove({
		_id:id,
		_creator:req.user._id
	}).then((data)=>{
		if(!data){
			res.status(400).send({error:"id not found"})
		}

		res.status(200).send({result:"id remvoed"})
	}).catch((e)=>{
		res.status(404).send()
	})
	
})

app.post("/users",(req,res)=>{

	var body = _.pick(req.body,["email","password"])
	var user = new User({
		email:body.email,
		password:body.password,
	
	})
	
	user.save().then(()=>{
	    return user.generateAuthToken()
	
	}).then((token)=>{
		res.header("x-auth",token).send(user)
	}).catch((e)=>{
		res.status(400).send(e)
	})
	
})

app.post("/users/login",(req,res)=>{
	var body = _.pick(req.body,["email","password"])
	User.findByCredentials(body.email,body.password).then((data)=>{
		if(!data){
			res.status(401).send()
		}
		return user.generateAuthToken().then((token)=>{
			res.header("x-auth",token).send(user)
		})
	}).catch((e)=>{
		res.status(401).send()
	})
})


var authenticate = (req,res,next) =>{
	var token = req.header("x-auth")

	User.findByToken(token).then((user)=>{
		if(!user){
			console.log("no user")
			return Promise.reject()
		}

		req.user = user
		req.token = token
		next()
	}).catch((e)=>{
		console.log("error")
		res.status(401).send()
	})
}


app.delete("users/me/token",authenticate,(req,res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send()
	}).catch((e)=>{
		res.status(400).send()
	})
})





app.get("/users/me",authenticate,(req,res)=>{
	res.send(req.user)
})

app.listen(port,()=>{
	console.log("start on port 300")
})

module.exports.app = app
