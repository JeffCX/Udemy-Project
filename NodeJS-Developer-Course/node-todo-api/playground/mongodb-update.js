
const {MongoClient,ObjectID} = require("mongodb")

var obj = new ObjectID();
console.log(obj)
MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
	
	db.collection("Users").findOneAndUpdate({
		_id:new ObjectID("5b2537529b68130bafd0222f")
	},{
		$set:{
			name:"Abby",
			
		},$inc:{
			age:1
		}
	},{
		returnOriginal:false
	}).then((result)=>{
		console.log(result)
	})


	
	

	db.close()

})