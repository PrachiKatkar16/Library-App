const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const userRouter=require('./routes/user.route')
const bookRouter=require('./routes/book.route')
const morgan = require('morgan');
require('dotenv').config();

// Connect to DB


const app = express();
app.use(cors({
    origin:'*'
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/',(req,res)=>{
    res.send("welcome");
})

// Routes
app.use('/api/auth',userRouter);
app.use('/api/books', bookRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT,async()=>{
    try {
        await connectDB;
        console.log(`Server is running on ${PORT} and connected to db`)
    } catch (error) {
        console.log(error)
    }
})