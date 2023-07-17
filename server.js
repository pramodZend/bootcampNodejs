const express = require('express');
const dotenv  = require('dotenv');
const morgan  = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const ErrorHandler = require('./middleware/error');
const CookieParser = require('cookie-parser');

const app = express();

//body parse middle ware
app.use(express.json());
app.use(CookieParser());

//load dotenv vars
dotenv.config({path:'./config/config.env'});

//connect db

connectDB();

//routes files
const bootcamps = require('./routes/bootcamps');
const auth     = require('./routes/auth');
const course   = require('./routes/course');

//const logger = require('./middleware/logger');
//dev logging middleware
if(process.env.NODE_ENV === 'development'){
    console.log('morgan middleware');
    app.use(morgan('dev'));
}
app.get('/api',(req,res)=>{
    res.send('Congratulations, NodeJs is working properlly')
})
app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/auth',auth);
app.use('/api/v1/courses',course);
app.use(ErrorHandler);

PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} MODE on port ${PORT}`.yellow.bold)
);

process.on('unhandledRejection',(err,promise)=>{
    console.log(`unhandled rejection ${err.message}`);
    //close server and exit process
    server.close(()=>process.exit(1));    
})
