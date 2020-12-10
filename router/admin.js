const express = require('express')
const app = express()

// call model for admin
const admin = require("../models/index").admin

const md5 = require("md5")

// middleware for allow the request from body
app.use(express.urlencoded({extended:true}))

//END-POINT Menampilkan Seluruh Data ADMIN
app.get("/", async(req,res) => {
    admin.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//END-POINT Menambahkan Data ADMIN
app.post("/", async(req,res) => {
    // tampung data yg akan dimasukkan
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // execute insert data
    admin.create(data)
    .then(result => {
        res.json({
            message: "Data has been inserted",
            data: result
        })
    })

    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//END-POINT Mengupdate/Mengedit Data ADMIN
app.put("/", async(req,res) => {
    // tampung data yg akan dimasukkan
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // key yg menunjukkan data yg akan diubah
    let parameter = {
        id_admin: req.body.id_admin
    }

    // execute insert data
    admin.update(data, {where: parameter})
    .then(result => {
        res.json({
            message: "Data has been updated",
            data: result
        })
    })

    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//END-POINT Menghapus Data ADMIN
app.delete("/:id_admin", async(req, res) => {
    let id_admin = req.params.id_admin

    let parameter = {
        id_admin: id_admin
    }

    admin.destroy({where : parameter})
    .then(result => {
        res.json({
            message: "Data has been deleted",
            data: result
        })
    })

    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app