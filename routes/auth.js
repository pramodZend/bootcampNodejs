const express = require('express');
const {register,login,getMe, forgotPassword, resetPassword} = require('../controllers/auth');
const router = express.Router();;
const { protect } = require('../middleware/auth'); 

router.post('/register',register);
router.post('/login',login);
router.post('/getMe',protect,getMe);
router.post('/forgotPassword',forgotPassword);
router.put('/resetPassword/:token',resetPassword);

module.exports = router;