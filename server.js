if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Required files importation 
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const writerRouter = require("./routes/writers");
const booksRouter = require("./routes/books");
const bodyParser = require("body-parser")
const methodOverride = require('method-override')

//Setting up Mongo DB Connection
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open' , ()=> console.log("connected to database"));


//Express app config
const app = express();

//Views and view engine setup
app.set('view engine' , 'ejs');
app.set('views' , __dirname + '/views');
app.set('layout' , 'layouts/layout');


//Public (css , js) files 
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit : "10mb" , extended : false}));

//Put , delete 
app.use(methodOverride('_method'))

// Urls . setting up routers
app.get('/' , indexRouter , () =>{console.log("rendering index")});
app.get('/writers' , writerRouter);
app.get('/writers/:id' , writerRouter);
app.get('/writers/:id/edit' , writerRouter);
app.put('/writers/:id' , writerRouter);
app.delete('/writers/:id' , writerRouter);
app.get('/writers/new' , writerRouter);
app.post('/writers' , writerRouter);
app.get('/books' , booksRouter);
app.get('/books/new' , booksRouter);
app.post('/books' , booksRouter);
app.get('/books/:id' , booksRouter);
app.get('/books/:id/edit' , booksRouter);
app.put('/books/:id' , booksRouter);
app.delete('/books/:id' , booksRouter);


app.listen(process.env.PORT || 5000);