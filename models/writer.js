const mongoose = require('mongoose');
const { remove } = require('./book');
const Book = require('./book');



const writerSchema = new mongoose.Schema({
    name :{
        type : String ,
        required : true
    }
})

writerSchema.pre('remove' , function(next){
    Book.find({writer : this.id} , (err , books) =>{
        if(err){
            next(err);
        } else if(books.length > 0){
            next(new Error('This writer has some books'));
        } else {
            next();
        }
    });
});

module.exports = mongoose.model('Writer' , writerSchema )