const { render } = require("ejs");
const express = require("express");
const Book = require("../models/book");
const writer = require("../models/writer");
const router = express.Router();
const Writer = require("../models/writer")

router.get('/writers' , async (req , res) =>{
    let options = {}
    if(req.query.name != null && req.query.name !== ''){
        options.name = new RegExp(req.query.name , 'i');
    }
    try{
        const writers = await Writer.find(options)
        res.render('writers/index' , {writers : writers , searchOptions : req.query})
    } catch{
        res.redirect("/")
    }
    res.render("writers/index");
});

router.get('/writers/new' , (req , res) =>{
    res.render("writers/new" , {writer : new Writer()});

});

router.post('/writers' , async (req , res) =>{
    const writer  = new Writer({
        name : req.body.name
    });
    try{
        const newwriter = await writer.save()
        res.redirect(`/writers/${newwriter.id}`);
    } catch{
        res.render('writers/new' , {writer : writer , errorMessage:'Error creating writer' })
    }
    
});

router.get('/writers/:id' , async (req , res) =>{
    try{
        const writer = await Writer.findById(req.params.id)
        const books = await Book.find({writer : writer.id}).limit(6)
        res.render('writers/show' ,{writer : writer , booksByWriter : books})
    } catch {
        res.redirect('/')
    }
})

router.get('/writers/:id/edit' , async (req , res) =>{
    try{
    const writer = await Writer.findById(req.params.id)
    res.render("writers/edit" , {writer : writer});
    }
    catch{
        res.redirect('/writers')
    }
}) 

router.put('/writers/:id' , async (req , res) =>{
    try{
        let writer = await Writer.findById(req.params.id)
        writer.name = req.body.name
        await writer.save()
        res.redirect(`${writer.id}`);
    } catch{
        if(writer == null){
            res.redirect('/')
        }
        else{
            res.render('writers/edit' , {writer : writer , errorMessage:'Error updating writer' })
        }
    }
})

router.delete('/writers/:id' , async (req , res) =>{
    try{
        let writer = await Writer.findById(req.params.id);
        await writer.remove();
        res.redirect('/writers');
    } catch{
        if(writer == null){
            res.redirect('/')
        }
        else{
            res.redirect('/writers')
        }
    }
})
module.exports = router; 

