const bcrypt = require("bcryptjs")
bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash("asdf123",salt,(err,hash)=>{
        console.log(hash)
    })
})

bcrypt.compare(password,)