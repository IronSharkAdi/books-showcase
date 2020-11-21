const express = require("express");
const router = express.Router();
 const Book = require("../models/book")

router.get('/' , async (req , res) =>{
    try{
        books = await Book.find().sort({createdAt : 'desc'}).limit(10).exec();
    }   
    catch{
        books = []
    }

    res.render("index" , {books : books});
    console.log("get req accepted and sent indes.ejs")
});

module.exports = router; 