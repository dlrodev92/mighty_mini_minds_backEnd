import jwt from "jsonwebtoken";
import{JWT_SECRET} from "../config.js";

export function createTokens(user){
    const accessToken = jwt.sign({userId: user.uuid, username: user.username, auth:true }, JWT_SECRET, {expiresIn: '1h'});
    return accessToken
}

export function validateToken(req, res, next){
    const accessToken = req.headers["token"];
    if(!accessToken) return res.status(400).json({message: "User not authenticated"});
    try{
        const validToken = jwt.verify(accessToken, JWT_SECRET);
        if(validToken){
            req.authenticated = true;
            return next();
        }
    }catch(error){
        return res.status(400).json({ message: error});
    }
}

export function authorizeUser(req, res, next){
    const accessToken = req.headers["token"];
    if(!accessToken) return res.status(400).json({message: "User not authenticated"});
    try{
        const decodedToken = jwt.decode(accessToken);
        if(decodedToken){
            req.authenticated = true;
            req.user_uuid = decodedToken.userId;
            console.log("User UUID:", req.user_uuid); // Logging user_uuid
            return next();
        }
    }catch(error){
        return res.status(400).json({ message: error});
    }
}
