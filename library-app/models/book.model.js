const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    // userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    createdAt: { type: Date, default: Date.now }
});
const BookModel = mongoose.model('Book', bookSchema);
module.exports=BookModel;
