//connect database mongodb
const mongoose = require('mongoose');
const connectDB = async()=>{
    const connect = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
       // useCreateIndex:true,
        //useFindAndModify:false
    })
    console.log(`mongodb connected ${connect.connection.host}`);
};
module.exports = connectDB;