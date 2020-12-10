const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const md5 = require("md5")

// model admin
const admin = require("../models/index").admin

app.use(express.urlencoded({extended: true}))

app.post("/login", async (req,res) => {
    let parameter = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let result = await admin.findOne({where: parameter})
    if(result == null){
        // invalid username or pass
        res.json({
            message: "Invalid Username or Password"
        })
    }else{
        // login success
        // generate token using jwt
        // jwt->header, payload, secretKey
        let jwtHeader = {
            algorithm: "HS256",
            expiresIn: "1h"
        }

        let payload = {data: result}
        let secretKey = "TokoKomputer"

        let token = jwt.sign(payload, secretKey, jwtHeader)
        res.json({
            data: result,
            token: token
        })
    }
})

module.exports = app