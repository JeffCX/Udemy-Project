var getUser = (id,callback)=>{
	var user = {
		id:id,
		name:"gan"
	}
	callback(user)
}

getUser(31,(user)=>{
	console.log(user)
})