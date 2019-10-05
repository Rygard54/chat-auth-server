const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');//get the header and remove the 'Bearer'
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET ); //verify that the token is valid

        const user = await User.findOne({ _id: decoded._id, "tokens.token":token }) //look for the user that has that id and look if the token exists in the user

        if(!user){
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next()

    }catch(e){
        res.status(404).send({Error:'please authenticate.'})
    }
}

module.exports = auth;