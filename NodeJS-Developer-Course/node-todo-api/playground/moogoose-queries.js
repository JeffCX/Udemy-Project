const {mongoose} = require("./../server/db/mongoose");
const {Todo} =require("./../server/models/todo");
const {ObjectID} = require("mongodb")
const {user} = require("./../server/models/User");
if(!ObjectID.isValid(id)){
	console.log("ID not valid")
}
var id=""
Todo.find({
	_id:id
}).then((todos)=>{
	console.log("Todos",todos)
})

Todo.findOne({
	_id:id
}).then((todo)=>{
	console.log("Todo",todo)
})

Todo.findById(id).then((todo)=>{
	if(!todo){
		return console.log("ID not found")
	}
	console.log("Todo ")
}).catch((e)=>{
	console.log(e)
})
//if Id is invalid then catch block run
user.findById(id).then((user)=>{
	if(!user){
		return console.log("fuck")
	}
	console.log(user)
}).catch((e)=>{
	console.log(e)
})