const router=require('express').Router()
const bcrypt=require('bcryptjs')
const User=require('../models/user/userModel')
const jwt=require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware')

// register a User

router.post('/register',async (req,res)=>{
    try {
        const userExist = await User.findOne({email:req.body.email})
        if(userExist){
            return res.send({
                success:false,
                message:"User Already Existss!!"
            })
        }

        //hash the password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password=hashedPassword
        const newUser= new User(req.body)
        await newUser.save()

        res.send({
            success:true,
            message:"Registration Successfull!!"
        })
    } catch (error) {
        console.log(error)
    }
})

// login routes

router.post('/login', async (req,res)=>{
    try {
        const user= await User.findOne({email:req.body.email})
        if(!user){
       return res.send({
        success:false,
        message:"User doesnot Exist!!!"
       })
        }

        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword){
            return res.send({
                success:false,
                message:"Wrong Password!!!"
            })
        }
      const token=jwt.sign({userid:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.send({
            success:true,
            message:"User Logged in!!!",
            data:token,
        })
        
    } catch (error) {
        console.log(error)
    }
   
})




router.get('/get-current-user', authMiddleware, async (req, res) => {
    try {
        console.log('Fetching user with ID:', req.userId); // Debugging: Log the userId being fetched
        const user = await User.findById(req.userId).select('-password');
        console.log('Fetched user:', user); // Debugging: Log the fetched user

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        res.send({
            success: true,
            message: "User details fetched successfully!",
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error); // Debugging: Log the error if any
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports=router