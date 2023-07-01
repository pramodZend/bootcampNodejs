const express = require('express');
const app = express();
router = express.Router({mergeParams:true});
const bodyParser = require('body-parser');


app.use(bodyParser.json());

router.get('/getEmployeeData',(req,res,next)=>{
    res.send({msg:"hello world"});

})


app.listen(process.env.port,()=>console.log(`server is listing on port ${process.env.port}`));


