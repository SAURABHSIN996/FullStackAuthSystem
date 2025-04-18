import User from "../models/user.model";
import { errorHandler } from "../utils/error";
import bycryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({
        message: "API is Working !!"
    });
};

//update user 
export const updateUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your account! '));
    }
    try{
        if(req.body.password){
            req.body.password = bycryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                },
            },
            { new: true } 
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch(error){
        next(error);
    }
};

//delete User
export const deleteUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account! '))
    }
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted. ');
    }
    catch(error){
        next(error);
    }
}