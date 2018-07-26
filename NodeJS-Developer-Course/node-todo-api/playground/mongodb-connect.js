const {MongoClient,ObjectID} = require("mongodb")

var obj = new ObjectID();
console.log(obj)
MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
	
	db.collection("Todos").insertOne({
		text:"something to do",
		completed:false
	},(err,result)=>{
		if(!err){
			console.log(JSON.stringify(result.ops,undefined,2))
		}
	})


	db.collection("Users").insertOne({
		name:"Jeff",
		age:"21",
		location:"Beijing"
	},(err,db)=>{
		if(!err){
			console.log(db.ops[0]._id.getTimestamp())
		}
	})

	db.close()

})