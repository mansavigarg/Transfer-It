const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");


const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startWith('Bearer')) {
        return res.status(403).json({
            message: "Not Authorized"
        })
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET)

        if(decoded.userID){
        req.userID = decoded.userID;
        next(); 
        } else {
            return res.status(403).json({});
        }

    } catch (err) {
        return res.status(403).json({
            message: "Error"
        })
    }
}

module.exports = {
    authMiddleware
}