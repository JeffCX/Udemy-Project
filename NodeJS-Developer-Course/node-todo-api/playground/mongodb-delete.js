const {MongoClient,ObjectID} = require("mongodb")

var obj = new ObjectID();
console.log(obj)
MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
	
	//deleteAll
	
	db.collection("Users").insertOne({
		name:"Cathy",
		age:"20",
		location:"chengdu"
	},(err,result)=>{
		console.log("gan")
	})

	db.collection("Users").insertOne({
		name:"Jeff",
		age:"20",
		location:"beijing"
	},(err,result)=>{
		console.log("gan")
	})

	/*
	db.collection("Users").deleteMany({
		name:"Jeff"
	}).then((result)=>{
		console.log(result)
	})*/


	//deletOne

	/*
	db.collection("Users").deleteOne({
		name:"Cathy"
	}).then((result)=>{
		console.log(result)
	})*/

	//findoneanddelete

	db.collection("Users").findOneAndDelete({
		_id: new ObjectID("5b2536bf1497bc0b8ef4738b")
	}).then((result)=>{
		console.log(result)
	})

})