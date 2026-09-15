/**
* RMIT University Vietnam
* Course: COSC3060 Web Programming Studio
* Semester: 2025B
* Assessment: Fullstack in-class Lab Test
* Author: nina
* ID: Your student ids (e.g. s1234567)
* Acknowledgement: Acknowledge the resources that you use here.
*/

// Declare packages used for this server file
const express = require('express');
require('dotenv').config();


// Setup server
const app = express();
app.set('view engine', 'ejs');




/** Routes */
//Public route
app.use(express.static('public'));


const { ReadingList, Book } = require('./db/bookModel');
// Homepage endpoint that when accessed will produce a random reading list for a week
app.get('/', async function (req, res) {
    const textbook = await Book.findOne({
        category: "TEXTBOOK"
    });
    const philosophy = await Book.findOne({
        category: "PHILOSOPHY"
    });
    const novel = await Book.findOne({
        category: "NOVEL"
    });
    res.render('list', {
        book: [
            textbook,
            philosophy,
            novel
        ]
    });
})


// Book endpoint that when accessed will show detail information about a book and related books found in the database
app.get('/book/:title', async function (req, res) {
    const
        res.render('book');
});


// Port number
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server started and is running on: http://localhost:${port}`);
});