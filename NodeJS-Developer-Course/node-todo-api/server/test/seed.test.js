const {ObjectID} = require("mongodb")
cosnt {Todo} = require("todo")
const {User } = require("user")


const users = [{
    _id:new ObjectID(),
    email:"xc1008@nyu.edu",
    password:"hello world",
    tokens:[
        access:"auth",
        token:jwt.sign({_id:userOneID,acecess:"auth"},"abc123").toString()
    ]
}, {
    _id:new ObjectID(),
    email:"xc1008@nyu.edu",
    password:"hello world",
    tokens:[

    ]
},{
    _id:new ObjectID(),
    email:"xc1008@nyu.edu",
    password:"hello world",
    tokens:[

    ]
} ]


const todos=[{
	_id: new ObjectID(),
    text:"First test todo",
    _creator:"1"
},{
	_id:new ObjectID(),
    text:"second test todo",
    _creator:"1"
}]

//empty database

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var UserOne = new User(users[0]).save()
        var userTwo = newUser(users[1]).save()
        return Promise.all([UserOne,usertwo]).then(()=>done())
    })
}





const populateTodos = ((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos).then(()=>{done()})
	})
})


module.exports = {populateTodos,todos,populateUsers}