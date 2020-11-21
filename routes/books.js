const express = require("express");
const router = express.Router();
const Book= require("../models/book");
const Writer = require("../models/writer");
const { collection, remove } = require("../models/book");
const { json } = require("body-parser");
const imageMimeTypes = ['image/jpeg' , 'image/png' , 'image/gif' , 'image/jpg']



router.get('/books' , async (req , res) =>{
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title , 'i'))
    }
    if(req.query.publishAfter != null && req.query.publishAfter != ""){
        query = query.gte('publishDate' , req.query.publishAfter)
    }
    if(req.query.publishBefore != null && req.query.publishBefore != ""){
        query = query.lte('publishDate', req.query.publishBefore)
    }
    try{
        const books = await query.exec();
        res.render('books/index', {books : books , searchOptions : req.query})
    }
    catch(error){
        res.redirect('/')
        console.log(error)
    }
});

router.get('/books/new' , async (req , res) =>{
    renderNewPage(res ,  new Book())
});

router.post('/books' , async (req , res) =>{
    const book = new Book({
        title : req.body.title ,
        writer : req.body.writer ,
        publishDate : new Date(req.body.publishDate) ,
        pageCount : req.body.pageCount ,
        description : req.body.description ,
    })
    saveCover(book , req.body.cover)

    try{
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } 
    catch{      
        renderNewPage(res , book  , true)
    }
});

router.get('/books/:id', async (req , res)=>{
    try{
    const book = await Book.findById(req.params.id).populate('writer').exec();
    res.render('books/show' , {book : book});
    } catch {
        res.redirect('/');
    }
})

router.get('/books/:id/edit', async (req , res)=>{
    try{
        const book = await Book.findById(req.params.id)
        console.log(book.title)
        renderEditPage(res , book)
    } catch{

    }
    
})

router.put('/books/:id', async (req , res)=>{
    try{
        let book = await Book.findById(req.params.id)
        book.title = req.body.title 
        book.writer = req.body.writer 
        book.publishDate = new Date(req.body.publishDate) 
        book.pageCount = req.body.pageCount 
        book.description = req.body.description 
        if(req.body.cover != null && req.body.cover != ''){
            saveCover(book , req.body.cover)
        }
        await book.save()
        res.redirect(`${book.id}`)
    } 
    catch(error){      
        if(book = null){

            renderEditPage(res , book , true)
        } else {
            console.log(error)
            res.redirect('/')
        }
        
    }
})

router.delete('/books/:id', async (req , res)=>{
    try{
        let book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch{
        if(book != null){
            res.render('book/show' ,{ errorMessage: 'Could not remove that book , sorry', book: book })
        } else {

        }
    }
})

async function renderNewPage(res , book , hasError = false){
    renderFormPage(res , book , 'new' , hasError = false)
}

async function renderEditPage(res , book , hasError = false){
    renderFormPage(res , book , 'edit' , hasError)
}

async function renderFormPage(res , book , form , hasError = false){
    try{
        const writers = await Writer.find({});
        const params = { writers :writers , book : book}
        if (hasError) params.errorMessage = "error creating book" 
        res.render(`books/${form}` ,params)
    }
    catch{
        res.redirect('/books')
    }
}



function saveCover(book , coverEncoded){
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
    }
}


module.exports = router; 


