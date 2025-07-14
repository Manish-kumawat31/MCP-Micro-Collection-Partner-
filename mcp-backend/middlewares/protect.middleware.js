import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect =async (req,res, next)=>{
try {
    const token  = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    if (!decode) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const user = await User.findById(decode.userid).select('-password');
    req.user = user;
    next();
  
} catch (error) {
    res.status(401).json({ message: `Not authorized, token failed ${error.message}`  });
}
}