const express = require("express")
const app = express()

// Call Router
let costumer = require("./router/costumer")
let product = require("./router/product")
let transaksi = require("./router/transaksi")
let admin = require("./router/admin")
let auth = require("./router/auth")

app.use("/costumer", costumer)
app.use("/product", product)
app.use("/transaksi", transaksi)
app.use("/admin", admin)
app.use("/auth", auth)

app.listen(8000, function (err) {
    if (!err)
        console.log("server run on port 8000");
    else console.log(err)
})
