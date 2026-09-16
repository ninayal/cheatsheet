/**
* RMIT University Vietnam
* Course: COSC3060 Web Programming Studio
* Semester: 2025B
* Assessment: Fullstack in-class Lab Test
* Author: Your names (e.g. Nguyen Van Minh)
* ID: Your student ids (e.g. s1234567)
* Acknowledgement: Acknowledge the resources that you use here.
*/

// Declare packages used for this server file
const express = require('express');
require('dotenv').config();


// Setup server
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

//==============Để đọc form=============
// Form HTML gửi dữ liệu dạng:
// title=Clean Code
// author=Robert Martin
// year=2008
// Express mặc định không hiểu.
// Middleware này chuyển thành:
// req.body = {
//  title:"Clean Code",
//  author:"Robert Martin",
//  year:2008

// }
app.use(express.urlencoded({
    extended: true
}));



/** Routes */
const { Book,ReadingList} = require('./db/bookModel');
// Homepage endpoint that when accessed will produce a random reading list for a week
app.get('/', async function (req, res) {
    const textbook = await Book.aggregate([
        {
            $match: { category: "TEXTBOOK" }
        },
        {
            $sample: { size: 1 }
        }
    ]);
    const philosophy = await Book.aggregate([
        {
            $match: { category: "PHILOSOPHY" }
        },
        {
            $sample: { size: 1 }
        }
    ]);
    const novel = await Book.aggregate([
        {
            $match: { category: "NOVEL" }
        },
        {
            $sample: { size: 1 }
        }
    ]);
    res.render('list', {
        book: [
            textbook[0],
            philosophy[0],
            novel[0]
        ],
        page: "home"
    });
})
app.get('/reading-list', async function(req,res){

    const readingList = await ReadingList.findOne();

    res.render('reading-list',{
        readingList
    });

});
app.post('/reading-list/add', async function(req,res){


    const newReadingList = new ReadingList({

        name:req.body.name,

        books:[]

    });


    await newReadingList.save();


    res.redirect('/reading-list');


});

app.post('/', async function (req, res) {
    const textbook = await Book.aggregate([
        {
            $match: { category: "TEXTBOOK" }
        },
        {
            $sample: { size: 1 }
        }
    ]);
    const philosophy = await Book.aggregate([
        {
            $match: { category: "PHILOSOPHY" }
        },
        {
            $sample: { size: 1 }
        }
    ]);
    const novel = await Book.aggregate([
        {
            $match: { category: "NOVEL" }
        },
        {
            $sample: { size: 1 }
        }
    ]);
    res.render('list', {
        book: [
            textbook[0],
            philosophy[0],
            novel[0]
        ],
        page: "home"
    });
})


//============Route cho POST ROute cho CRUD - Create========Add new book =============
app.post('/add', async function (req, res) {
    if (
        !req.body.title ||
        !req.body.author ||
        !req.body.year ||
        !req.body.description
    ) {
        return res.send("Please complete all fields");
    }

    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        year: req.body.year,
        image: req.body.image,
        description: req.body.description
    });

    await newBook.save();
    res.redirect('/');
});


//===========================Route cho POST ROute cho CRUD - UPDATE========Edit book====================
app.get('/edit/:id', async function (req, res) {

    const book = await Book.findById(
        req.params.id
    );
    res.render('partials/edit', {
        book: book
    });

});

app.post('/edit/:id', async function (req, res) {
    await Book.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            description: req.body.description
        }
    );
    res.redirect('/');
});



//===========================Route cho POST ROute cho CRUD - Delete========Delete book from database====================
app.post('/delete/:id', async function(req,res){

    await Book.findByIdAndDelete(
        req.params.id
    );


    res.redirect('/');

});











//===================== ADD BOOK TO READING LIST =====================
app.post('/reading-list/add-book/:id', async function(req,res){

    const book = await Book.findById(req.params.id);

    const readingList = await ReadingList.findOne();

    if(!readingList){
        return res.send('Please create a reading list first');
    }

    readingList.books.push(book);

    await readingList.save();

    res.redirect('/reading-list');

});

// Book endpoint that when accessed will show detail information about a book and related books found in the database
app.get('/book/:title', async function (req, res) {
    const title = req.params.title;
    const book = await Book.findOne({
        title
    });
    const relatedbook = await Book.find({
        category: book.category
    })
    res.render('book', {
        book, relatedbook, page: "book"
    });
});
app.get('/filter', async function (req, res) {
    const category = req.query.category;
    let book;
    if (category == "ALL") {
        book = await Book.find()
    }
    else {
        book = await Book.find({
            category
        })
    }

    res.render('list', {
        book: book,
        page: "home"
    });
});

//=========================Get Route để mở form===============================
app.get('/add', function (req, res) {

    res.render('add');

});





// Port number
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server started and is running on: http://localhost:${port}`);
});