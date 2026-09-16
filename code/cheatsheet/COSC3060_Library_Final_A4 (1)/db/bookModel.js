
const mongoose = require('./mongoose');

const bookSchema = new mongoose.Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    year:{type:Number, required:true},
    category:{type:String, required:true},
    image:String,
    description:{type:String, required:true},
    status:{type:String, default:"recommended"}
});

const readingListSchema = new mongoose.Schema({
    name:{type:String, required:true},
    books:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Book"
        }
    ]
});

const Book = mongoose.model('Book', bookSchema);
const ReadingList = mongoose.model('ReadingList', readingListSchema);

module.exports={Book,ReadingList};
