import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/utils.js';

export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already registered" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password Must be atleast 6 characters" });
        }
        const hashpass = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashpass, role });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role });
        } else {
            res.status(400).json({ message: "Invaild user data" })
        }


    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credential" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credential" });

        generateToken(user._id, res);
        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt" , "" , {
            maxAge: 0
        })
        res.status(200).json({message : "logout sucess" });
        
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message})
    }
}

export const checkAuth = (req , res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller:" , error);
        res.status(500).json({message:error});
    }
}