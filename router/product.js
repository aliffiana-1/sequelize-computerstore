const express = require("express")
const app = express()

// call model for product
const product = require("../models/index").product

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
        cb(null, "./image/product")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})
// ----------------------------------------------------

// END-POINT Menampilkan Seluruh Data PRODUCT
app.get("/", (req,res) => {
    product.findAll()
    .then(product => {
        res.json({
            data: product
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

// END-POINT Menambahkan Data PRODUCT
app.post ("/", upload.single("image"), (req,res)=>{
    if(!req.file) {
        res.json({
            message: "no uploaded image"
        })
    }else {
        let data = {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            image: req.file.filename
        }

        product.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted",
                data: result
            })
        })
        .catch(error => {
            message: error.message
        })
    }
})

//END-POINT Mengupdate/Mengedit Data PRODUCT
app.put("/", upload.single("image"), (req,res)=>{
    let param = {id_product: req.body.id_product}
    let data = {
        ame: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
    }

    if(req.file){
        //mengambil data lama yang sesuai dengan parameter
        const row = product.findOne({where:param})
        .then(result => {
            //mengambil nama image
            let oldFileName = result.image

            //menghapus gambar lama
            let dir = path.join(__dirname, "../image/product",oldFileName)
            fs.unlink(dir, err => console.log(err))
        })
        .catch(error => {
            console.log(error.message)
        })

        //dapatkan file gambar baru
        data.image = req.file.filename

        product.update(data, ({where:param}))
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error=>{
            res.json({
                message: error.message
            })
        })
    }
})

//END-POINT Menghapus Data PRODUCT
app.delete("/:id_product", async (req,res)=>{
    try{
        let param = {id_product: req.params.id_product}
        //dapatkan data yang akan dihapus
        let result = await product.findOne({where: param})
        //temukan file gambar
        let oldFileName = result.image

        //delete file gambar lama
        let dir = path.join(__dirname,"../image/product",oldFileName)
        fs.unlink(dir,err => console.log(err))

        //hapus data dari tabel
        product.destroy({where:param})
        .then(result=>{
            res.json({
                message:"data has been deleted"
            })
        })
        .catch(error=>{
            res.json({
                message:error.message
            })
        })
    } catch {
        res.json({
            message:error.message
        })
    }
})

module.exports = app