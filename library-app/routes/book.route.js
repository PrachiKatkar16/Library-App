const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');
const authMiddleware=require("../middlwares/authMiddleware");
const BookModel = require('../models/book.model');

router.post('/', authMiddleware(['CREATOR']), async (req, res) => {
    const { title, author } = req.body;
    // const userId=req.user._id;
    try {
        const book = new BookModel({ title, author});
        await book.save();
        res.status(201).json({message:"Book created successfully"})
    } catch (err) {
        console.log("error..")
        res.status(400).json({ msg: err.message });
    }
});


router.get('/', async (req, res) => {
    const { old, new: recent } = req.query;
    const now = new Date();
    const tenMinutesAgo = new Date(now - 10 * 60 * 1000);
    let filter = {};

    if (old) {
        filter.createdAt = { $lte: tenMinutesAgo };
    } else if (recent) {
        filter.createdAt = { $gte: tenMinutesAgo };
    }

    try {
        const books = await BookModel.find(filter);
        res.json(books);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});


router.delete('/:id', authMiddleware(['CREATOR']), async (req, res) => {
    const bookId=req.params.id;
    console.log(bookId);
    try {
        
       
            await BookModel.findByIdAndDelete({_id:bookId})
            res.status(200).json({message:"Book deleted successfully"})
       
    } catch (error) {
        res.status(500).json({message:"Error while deleting book"})
    }
});


router.put('/:id', authMiddleware(['CREATOR']), async (req, res) => {
    const { title, author } = req.body;
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        book.title = title || book.title;
        book.author = author || book.author;
        await book.save();
        res.json(book);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

module.exports = router;
