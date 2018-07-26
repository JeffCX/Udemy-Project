const {mongoose} = require("./../server/db/mongoose");
const {Todo} =require("./../server/models/todo");
const {ObjectID} = require("mongodb")
const {user} = require("./../server/models/User");
//Todo.remove({})
//Todo.findOneAndRemove() //return the removed value
//Todo.findByIdAndRemove() //return the removed value