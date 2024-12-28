const express = require('express');
const userRouter = require('./user');
const accoutRouter = require('./account');
const router = express.Router();

router.use('/user',userRouter);
router.use('/account',accoutRouter);

router.get('/',(req,res)=>{
    res.json({msg:'req came'});
})




module.exports = router;