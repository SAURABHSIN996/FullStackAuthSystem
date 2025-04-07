import User from "../models/user.model";
import { errorHandler } from "../utils/error";
import bycryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({
        message: "API is Working !!"
    });
};

//update user 
