import jwt from 'jsonwebtoken';
export const generateToken = (userid, res) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwt", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV !== "development",
        httpOnly: true,
        sameSite: "None"
    });
    return token;
}