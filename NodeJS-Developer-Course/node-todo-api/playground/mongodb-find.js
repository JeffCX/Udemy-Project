const {MongoClient,ObjectID} = require("mongodb")


MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
	
	db.collection("Todos").find().count().then((count)=>{
		console.log(JSON.stringify(docs,undefined,2))
	}).catch((err)=>{
		console.log(err)
	})

	db.close()

})