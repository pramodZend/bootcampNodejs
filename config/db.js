//connect database mongodb
const mongoose = require('mongoose');
const connectDB = async()=>{
    if(process.env.NODE_ENV == 'development'){
        const connect = await mongoose.connect(process.env.MONGO_LOCAL_URI,{
            useNewUrlParser:true,
           // useCreateIndex:true,
            //useFindAndModify:false
        })
        console.log(`mongodb connected in ${process.env.NODE_ENV} using ${connect.connection.host}`);
    }else{
        console.log(`mongodb connected ${process.env.NODE_ENV}`);
    }
   
   
};
module.exports = connectDB;