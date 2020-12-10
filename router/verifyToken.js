const jwt = require("jsonwebtoken")

verifyToken = (req,res,next) => {
    let headers = req.headers.authorization
    let token = null

    if(headers != null) {
        token = headers.split(" ") [1]
        // headers = Bearer kode_token
        // split => untuk mengkonversi string menjadi array
        /* di header authorization = Bearer (token), untuk menghilangkan kata "Bearer"
          untuk mengambil tokennya saja menggunakan split */
        // array = ["Bearer", "kode_token"]
    }

    if(token == null) {
        res,json({
            message: "Token Unauthorized / Token Tidak Dikenali"
        })
    }else{
        let jwtHeader = {
            algorithm: "HS256"
        }

        let secretKey = "TokoKomputer"

        jwt.verify(token, secretKey, jwtHeader, err => {
            if(err){
                res.json({
                    message: "Invalid or Expired Token"
                })
            }else{
                next()
            }
        })
    }
}

module.exports = verifyToken