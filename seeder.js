
const fs = require('fs');
const mongoose  =   require('mongoose');
const Bootcamp  =   require('./models/Bootcamp');
const dotenv    =   require('dotenv');
const colors    =   require('colors');
const Course    =   require('./models/Course');
const Users     =   require('./models/users');

//load env variables
dotenv.config({path:'./config/config.env'});

// const DBConnect = async()=>{
//     console.log("db connection initialization start....")
//     try {
//         await mongoose.connect('mongodb+srv://pramod152002:jAOsXwqxPYtxkDF5@cluster0.0w6ohlh.mongodb.net/test',{
//             useNewUrlParser:true
//         });
//         console.log("db connected".green);        
//     } catch (error) {
//         console.log("error in db connections".red);
//     }     
// }
const connectDB = async()=>{
    const connect = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
       // useCreateIndex:true,
        //useFindAndModify:false
    })
    console.log(`mongodb connected ${connect.connection.host}`);
};
connectDB();
//read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamp.json`,encoding='utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/course.json`,encoding='utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,encoding='utf-8'));

const importData = async()=>{
    try {

        await Users.create(users);   
        await Bootcamp.create(bootcamps);   
        await Course.create(courses);

        console.log("Importing data.....".green.inverse);
        process.exit();
    } catch (error) {
        console.log(error)
    }
};


const deleteData = async()=>{
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await Users.deleteMany();
        console.log("deleting data....".red.bgRed);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}


if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}