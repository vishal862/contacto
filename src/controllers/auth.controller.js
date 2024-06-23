import { User } from "../model/users.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const signUp = async (req,res,next)=>{
    try {
        const {username,password} = req.body;
    
        if(!username || !password){
            return next(errorHandler(400,'enter all the credentials'));
        }
    
        const existedUser = await User.findOne({username});
    
        if(existedUser){
            return next(errorHandler(400,'user exists'));
        }
    
        const hashedPassword = await bcryptjs.hash(password,10);
    
        const user = await User.create({
            username,
            password : hashedPassword
        })

        const newUser = await User.findById(user._id).select(["-password"])

    
        return res.status(200).json(newUser)
    } catch (error) {
        next(error);
    }
}

export const login = async (req,res,next)=>{
    try {
        const {username,password} = req.body;
        console.log(username,password);
    
        if(!username || !password){
            return next(errorHandler(400,"all fields are required"));
        }
    
        const validUser = await User.findOne({username});
    
        if(!validUser){
            return next(errorHandler(404,'user not found!'))
        }
    
        const decodedPassword = bcryptjs.compareSync(password,validUser.password);
    
        if(!decodedPassword){
            return next(errorHandler(400,'wrong password'));
        }
    
        const token = jwt.sign({id : validUser._id},process.env.JWT_SECRET);
    
        const {password : pass , ...rest} = validUser._doc
    
        res
        .status(200)
        .cookie("token",token,{
            httpOnly : true,
            secure : true
        })
        .json(rest);
    } catch (error) {
        next(error);
    }
}