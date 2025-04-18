import User from "../models/user.model";
import { errorHandler } from "../utils/error";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

//signup
export const signup = async(req,res,next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});

    try{
        await newUser.save();
        res.status(201).json({message: "User created successfully !" });
    } catch(err){
        next(err);
    }
};

//signin
export const signin = async(req,res,next) => {
    const { email, password} = req.body;
    try{
        const validUser = await User.findOne({ email });
        if(!validUser) return next(errorHandler(404, "User not found !"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(403, "Wrong Credentials !"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000); //cookie for 1 hr

        res
            .cookie("access_token", token, {httpOnly: true, expires: expiryDate})
            .status(200)
            .json(rest);
    } catch(error){
        next(error);
    }
};