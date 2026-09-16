
const express=require('express');
require('dotenv').config();

const {Book,ReadingList}=require('./db/bookModel');

const app=express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


// Homepage READ
app.get('/',async(req,res)=>{
    const books=await Book.find();
    res.render('list',{books});
});


// SEARCH
app.get('/search',async(req,res)=>{
    const keyword=req.query.keyword;

    const books=await Book.find({
        title:{
            $regex:keyword,
            $options:"i"
        }
    });

    res.render('list',{books});
});


// FILTER
app.get('/filter',async(req,res)=>{
    const category=req.query.category;

    let books;

    if(category=="ALL"){
        books=await Book.find();
    }
    else{
        books=await Book.find({category});
    }

    res.render('list',{books});
});


// SORT
app.get('/sort',async(req,res)=>{
    const books=await Book.find().sort({year:1});
    res.render('list',{books});
});


// DETAIL
app.get('/book/:title',async(req,res)=>{
    const book=await Book.findOne({
        title:req.params.title
    });

    res.render('book',{book});
});


// CREATE READING LIST PAGE
app.get('/reading-list',async(req,res)=>{
    const lists=await ReadingList.find()
    .populate('books');

    const books=await Book.find();

    res.render('reading-list',{
        lists,
        books
    });
});


// CREATE READING LIST
app.post('/reading-list/create',async(req,res)=>{

    const newList=new ReadingList({
        name:req.body.name,
        books:[]
    });

    await newList.save();

    res.redirect('/reading-list');
});


// ADD BOOK TO LIST
app.post('/reading-list/add/:id',async(req,res)=>{

    const list=await ReadingList.findOne();

    list.books.push(req.params.id);

    await list.save();

    res.redirect('/reading-list');
});


// REMOVE BOOK
app.post('/reading-list/remove/:id',async(req,res)=>{

    const list=await ReadingList.findOne();

    list.books.pull(req.params.id);

    await list.save();

    res.redirect('/reading-list');
});


// CREATE BOOK
app.post('/add',async(req,res)=>{
    const book=new Book(req.body);
    await book.save();
    res.redirect('/');
});


// UPDATE
app.post('/edit/:id',async(req,res)=>{
    await Book.findByIdAndUpdate(
        req.params.id,
        req.body
    );

    res.redirect('/');
});


// DELETE
app.post('/delete/:id',async(req,res)=>{
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/');
});


app.listen(4000,()=>{
console.log("http://localhost:4000");
});
