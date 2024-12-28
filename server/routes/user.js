const express = require('express');
const zod = require('zod');
const argon2 = require('argon2')
const jwt = require('jsonwebtoken');
const { User, Account } = require('../db');
const authMiddleware = require('../middleware');
const router = express.Router();

router.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET

async function hashPassword(password){
    return await argon2.hash(password);
}

async function verifyPassword(hash,password) {
    return await argon2.verify(hash, password);
}

const signupSchema = zod.object({
    firstName : zod.string().min(2,{message : "first name is required"}),
    lastName : zod.string().min(2,{message : "last name is required"}),
    username : zod.string().min(3,{message : "username is required"})
                .regex(/^\S+$/,{message : "username should not contain any spaces"}),
    email : zod.string().email({message : "invalid email address"}),
    password : zod.string().min(8,{message : "password should be minimum length of 8"})
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { 
                    message: "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
                })
    
})


function inputValidation(req,res,next){
    const data = req.body;
    const response = signupSchema.safeParse(data);
    if(!response.success){
        const errors = response.error.errors.map(err=>({
            path : err.path,
            message : err.message
        }));
        return res.status(400).json(errors);
    }
    next();
}

async function userExist(req,res,next){
    const { email, username } = req.body;

    try{
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(409).json({msg:"this email is already been used"});
        }
        const user = await User.findOne({username});
        if(user){
            return res.status(409).json({msg : "username is already used"});
        }
        next()
    }catch(err){
        console.error("Error checking user existence:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

async function stroreInDataBase(req,res,next){
    const {firstName, lastName, email, username, password} = req.body;
    const password_hashed = await hashPassword(password);
    console.log('hashed password : ' , password_hashed);
    const newUser = new User({
        firstName,
        lastName,
        email,
        username,
        password_hashed
    });

    try{
        await newUser.save();
        const userId = newUser._id;
        req.userId = newUser._id;
        await Account.create({
            userId,
            balance : 1 + (Math.random() * 10000)
        });
        next();
    }catch(err){
        console.error('error' , err);
        return res.status(500).json('failed to create user' , err);
    }
}

router.post('/signup',inputValidation,userExist,stroreInDataBase,(req,res)=>{
    const token = jwt.sign({userId : req.userId},JWT_SECRET);
    res.json({
        success : "everything was good",
        Token : token
    });

})



const signinSchema = zod.object({
    username : zod.string().min(2,{message : 'username can not be this short'}),
    password : zod.string().min(4,{message : 'password can not be this short'})
});

function signinInputValidation(req,res,next){
    const response = signinSchema.safeParse(req.body);
    if(!response.success){
        const errors = response.error.errors.map(err=>({
            path : err.path,
            message : err.message
        }));
        console.log('returning the zod');
        return res.status(411).json(errors);
    }
    next();
}

async function signinValidate(req,res,next){
    const {username , password} = req.body;
    const user = await User.findOne({
        $or : [
            {email : username},
            {username : username}
        ]
    });

    if(!user){
        return res.status(400).json({message : "user does not exist"});
    }
    const hash = user.password_hashed;
    const isCorrect = await verifyPassword(hash, password);
    if(!isCorrect){
        return res.status(411).json({message : "password is not correct"});
    }
    req.userId = user._id;
    next();
}


router.post('/signin',signinInputValidation, signinValidate,(req,res)=>{
    const token = jwt.sign({userId : req.userId}, JWT_SECRET);
    res.json({
        message : 'log in successfully',
        Token : token
    });
})



const updateSchema = zod.object({
    password : zod.string().min(8,{message : 'password should be at least of 8 characters'})
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    {message : 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'}).optional(),
    firstName : zod.string().min(2,{message : "enter the valid first name"}).optional(),
    lastName : zod.string().min(2,{message : "enter the valid last name"}).optional()                    
});


async function previousPasswordCheck(_id,password){
    const user = await User.findOne({_id},{ password_hashed: 1 });
    if (!user) throw new Error("User not found");
    return await verifyPassword(user.password_hashed, password);

}

async function updateInputValidation(req,res,next){
    
    const response = updateSchema.safeParse(req.body);
    const {password} = req.body;

    if(!response.success){
        const errors = response.error.errors.map(err=>({
            path : err.path,
            message : err.message
        }));

        return res.status(400).json(errors);
    }
    
    
    if(password && await previousPasswordCheck(req.userId,password)){
        return res.status(400).json({message : "enter unique password from previous password"});
    }

    const password_hashed = await hashPassword(password);
    req.body.password_hashed = password_hashed;

    try {
        await User.updateOne({ _id: req.userId }, req.body);
    } catch (err) {
        console.error("Error updating user info:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
    

    next();
    
}

router.put('/updateinfo', authMiddleware,updateInputValidation,(req,res)=>{
    res.json({success : "updated successfully"});
})


router.get('/bulk',authMiddleware,async (req,res)=>{
    const filter = req.query.filter || "";
    const userId = req.userId;

    const users = await User.find({
        $and : [
            {
                _id : {$ne : userId}
            },
            {
                $or : [
                {
                   firstName : {
                    $regex : filter,
                    $options : 'i'
                   }
                },
                {
                    lastName : { 
                        $regex : filter,
                        $options : 'i'
                    }
                }
            ]
            }
        ]
            
    })

    res.json({
        user : users.map(user =>({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
    })
    
})

router.get('/getinfo',authMiddleware,async (req,res)=>{
    try{
        const userinfo = await User.findOne({_id : req.userId}, {username : 1 , firstName : 1, lastName : 1});
        res.json(userinfo);
    }
    catch(error){
        res.status(401).send('unauthorized access');
    }
});


module.exports = router;