const express = require("express")
const app = express()

// call model for level
const costumer = require("../models/index").costumer

// authorization
const verifyToken = require("./verifyToken")

// call library multer
// ----------------------------------------------------
// library u/ upload file
const multer = require("multer")
// multer digunakan u/ membaca data request dari form-data

const path = require("path")
// path digunakan u/ manage direktori file

const fs = require("fs")
// fs digunakan u/ mengatur file

// tentukan di mana file akan disimpan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/costumer")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})
// ----------------------------------------------------

// END-POINT Menampilkan Seluruh Data COSTUMER
app.get("/", verifyToken, (req,res) => {
    costumer.findAll()
    .then(costumer => {
        res.json({
            data: costumer
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

// END-POINT Menambahkan Data COSTUMER
app.post ("/", upload.single("image"), (req,res)=>{
    if(!req.file) {
        res.json({
            message: "no uploaded image"
        })
    }else {
        let data = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            image: req.file.filename
        }

        costumer.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted",
                data: result
            })
        })
        .catch(error=>{
            message: error.message
        })
    }
})

//END-POINT Mengupdate/Mengedit Data COSTUMER
app.put("/", upload.single("image"), async(req,res)=>{
    let param = {id_costumer: req.body.id_costumer}
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
    }

    if(req.file){
        //mengambil data lama yang sesuai dengan parameter
        let oldFoto = await costumer.findOne({where: param})
        let oldGambar = oldFoto.image

        // delete old File
        let pathFile = path.join(__dirname, "../image/costumer", oldGambar)
        fs.unlink(pathFile, error => console.log(error))

        data.image = req.file.filename
    }

    // execute insert data
    costumer.update(data, ({where: param}))
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

//END-POINT Menghapus Data COSTUMER
app.delete("/:id_costumer", async(req,res)=>{
    let id_costumer = req.params.id_costumer

    let parameter = {
        id_costumer: id_costumer
    }

    //mengambil data lama yang sesuai dengan parameter
    let oldFoto = await costumer.findOne({where: parameter})
    let oldGambar = oldFoto.image

    // delete old File
    let pathFile = path.join(__dirname, "../image/costumer", oldGambar)
    fs.unlink(pathFile, error => console.log(error))

    // execute insert data
    costumer.destroy(({where: parameter}))
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