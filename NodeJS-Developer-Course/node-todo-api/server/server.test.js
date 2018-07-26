const expect = require("expect")
const request = require("supertest")
const {app} = require("./../server.js")
const  {Todo} = require("./../models/todo.js")
const {ObjectID} = require(mongodb)

const todo=[{
	_id: new ObjectID(),
	text:"First test todo"
},{
	_id:new ObjectID(),
	text:"second test todo"
}]

beforeEach(populatreUsers);
beforeEach(popularTodos)


//empty database
beforeEach((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos).then(()=>{done()})
	})
})



describe("POST /todos",()=>{
	it("should create a new todo",(done)=>{
		var text = "text todo text";
		require(app).post("/todos").set("x-auth",user[0].tokens.token).send({text:"caojiba"}).expect(200).expect((data)=>{
			expect(res.body.text).toBe(text)
		}).end((err,res)=>{
			if(err){
				return done(err)
			}
			Todo.find().then((todos)=>{
				expect(todos.length).toBe(1)
				expect(todos[0].text).toBe(text)
				done()
			}).catch((e)=>{
				done(e)
			})
		})
	})

	it("should not create a new todo",(done)=>{

		require(app).post("/todos").set("x-auth",user[0].tokens.token).send(123).end((err,res)=>{
			if(err){
				return done(err)
			}
			Todo.find().then((todos)=>{
				expect(todos.length.toBe(0))
			}).catch((e)=>{done(e)})
		})
	})
})

describe("Get /todos",()=>{
	request(app).get("/todos").set("x-auth",user[0].tokens.token).expect(200).expect((res)=>{
		expect(res.body.todos.length).toBe(2)
	}).end(done)
})

describe("get /todos/id",()=>{
	it("should return valid id ",(done)=>{
		request(app).get(`/todos/${todos[0]._id}`).set("x-auth",user[0].tokens.token).expect(200).expect((res)=>{
			expect(res.body.todo.text).toBe(todos[0].text)
		}).end(done)
	})


	it("should return valid id ",(done)=>{
		request(app).get(`/todos/${todos[1]._id}`).set("x-auth",user[0].tokens.token).expect(404).expect((res)=>{
			expect(res.body.todo.text).toBe(todos[0].text)
		}).end(done)
	})

	it("should return 404",(done)=>{
		request(app).get("/todos/123").set("x-auth",user[0].tokens.token).expect(404).expect((res)=>{
			expect(res.body.todo).toNotBe(todos[0].text)
		}).end(done)
	})

	it("should return 404",(done)=>{
		request(app).get(`/todos/${validid}`).set("x-auth",user[0].tokens.token).expect(404).expect((res)=>{
			expect(res.body.todo).toNotBe(todos[0].text)
		}).end(done)
	})

})

describe("delete /todos/id",()=>{
	it("should remove a todo",(done)=>{
		var hexId = todos[1]._id.toHexString()
		request(app).delete(`/todos/${hexId}`).set("x-auth",user[0].tokens.token).expect(200).expect((res)=>{
			expect(res.body.todo._id).toBe(hexId)
		}).end((err,res)=>{
			if(err){
				return done(err)
			}
			Todo.findById(hexId).then((data)=>{
				expect(data).toNotExist();
				done()

			}).catch((e)=>done(e))
		})
	})

	it("should return 404",(done)=>{
		request(app).delete("/todos/123").set("x-auth",user[0].tokens.token).expect(404).expect((res)=>{
			expect(res.body.todo).toNotBe(todos[0].text)
		}).end(done)
	})

	it("should return 404",(done)=>{
		request(app).delete("/todos/123").set("x-auth",user[0].tokens.token).expect(404).expect((res)=>{
			expect(res.body.todo).toNotBe(todos[0].text)
		}).end(done)
	})
})

describe("patch /todos/:id",()=>{
	var hexId = todos[1]._id.toHexString()
	var text="cao ni ma"
	it("should update the todo",(done)=>{
		request(app).patch(`/todos/${hexId}`).set("x-auth",user[0].tokens.token).send({
			completed:true,
			text
		}).expect(200).expect((res)=>{
			expect(res.body.todo).toEqual({
				text:res.body.todo.text,
				completed:true
			}).end(done)

			}
		})
	})

	it("should update the todo",(done)=>{
		request(app).patch(`/todos/${hexId}`).set("x-auth",user[0].tokens.token).expect(200).expect((res)=>{
			expect(res.body.todo).toEqual({
				text:res.body.todo.text,
				completed:false
			}).end((err,res))=>{
				if(err){
					return done(err)
				}

				Todo.findById(hexId).then((data)=>{
					expect(data.completed).toBe(false)
					expect(data.completedAt).toNotExist()
					done()
				}).catch((e)=>{
					done(e)
				})
			}
		})
	})

	it("should update the todo",(done)=>{
		request(app).patch(`/todos/${hexId}`).set("x-auth",user[1].tokens.token).expect(404).expect((res)=>{
			expect(res.body.todo).toEqual({
				text:res.body.todo.text,
				completed:false
			}).end((err,res))=>{
				if(err){
					return done(err)
				}

				Todo.findById(hexId).then((data)=>{
					expect(data.completed).toBe(false)
					expect(data.completedAt).toNotExist()
					done()
				}).catch((e)=>{
					done(e)
				})
			}
		})
	})
})


describe("Get /users/me",()=>{
	it("should return user if auth",(done)=>{
		request(app).get("/users/me").header("x-auth",users[0].tokens.token).expect(200).expect(((res)=>{
			expect(status).toBe(200)
			expect(res.body.email).toBe(users[0].email)
			expect(res.body._id).toBe(users[0]._id.toHexString())
		})).end(done)
	})

	it("should if not auth",(done)=>{
		var data = {}
		request(app).get("/users/me").header("x-auth","dafddsa").expect(401).expect((res)=>{
			expect(res.body).toEqual({})
		}).end(done)
	})



	it("should create user if email if valid",(done)=>{
		email="xc1008@nyu.edu"
		password = "dafewsd"
		request(app).post("/user").send({email,password}).expect(200).expect((res)=>{
			expect(res.body.email).toBe(email)
			expect(res.body.password).toBe(password)
			expect(res.body.tokens.access).toBe("access")
		}).end((err)=>{
			if(err){
				return done(err)
			}
		})

		User.findOne({email}).then((user)=>{
			expect(user.ToExit())
			done()
		})
	})

	it("should not create user if email in user",(done)=>{
		email="xc1008@nyu.edu"
		password=""
		request(app).post("/user").send({email,password}).expect(400).expect((res)=>{
			expect(res.body).toNotExist()
		}).end(done)
	})

	it("should return validation erros if request invalid",(done)=>{
		email="xc1008a@nyu.edu"
		jiba=""

		request(app).post("/user").send({email,jiba}).expect(400).expect((res)=>{
			expect(res.body).toNotExist()
		}).end(done)

	})
})

describe("test login",()=>{
	it ("valid login",()=>{
		request(app).post("/users/login").send({email:user[1].email,password:user[1].password}).expect(200).expect((res)=>{
			expect(res.body.email).toBe(user[1].email)
			expect(res.header["x-auth"]).toBe(user[1].tokens.token)
		}).end((err,result)=>{
			if(err){
				return done(err)
			}
			user.findById(user[1]._id).then((user)=>{
				expect(user.tokens[0].toInclude({
					access:"auth",
					token:res.headers["x-auth"]
				}))
				done()
			}).catch((e)=>done(e))
		})
	})

	it ("invalid login",()=>{
		request(app).post("/users/login").send({email:user[1].email,password:user[1].password}).expect(400).expect((res)=>{
			expect(res.body.email).toNotExist()
			done(e)
		}).end((e)=>{
			done(e)
		})
	})
	
})

describe("delete token",()=>{
	it("should remove auth token on logout",(done)=>{
		request(app).delete("/users/delete/token").set("x-auth",users[0].tokens.token).expect(200).end((err,result)=>{
			if(err){
				return done(err)
			}
			User.findById(users[0]._id).then((user)=>{
				expect(user.tokens.length).toBe(0)
				done()
			}).catch((e)=>done(e))
		})
	})
})

