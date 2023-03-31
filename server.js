const express = require('express');
const dotenv  = require('dotenv');
const app = express();

//load dotenv vars
dotenv.config({path:'./config/config.env'});

PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} MODE on port ${PORT}`)
);
