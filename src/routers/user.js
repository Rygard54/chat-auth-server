const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth')
const { sendWelcomeEmail , sendCancelEmail } = require('../emails/account')
const socketIOClient = require ('socket.io-client');

const endpoint = process.env.SOCKET_ENDPOINT
const socket = socketIOClient(endpoint);

const router = new express.Router();

//Create User --------------------------------

router.post('/auth/create',async (req,res)=>{
    console.log(req.body)
    console.log(endpoint)
    const user = new User(req.body) //we pass the object with the attributes, we allready have it in req object
    
    try{
        await user.save();
        socket.emit('CREATEACCOUNT', req.body);
        console.log('SE ENVIO EL MENSAJE PARA OTRO SERVER')
        sendWelcomeEmail( user.email , user.userName ); //call the function to send an email to the new user

        // const token = await user.generateAuthToken(); // generate the token to validate the created user 
        res.status(201).send( { user } );
    }catch(e){
       
        res.status(400).send(e)
    }
    // res.status(200).send('works');
});

router.post('/', async (req,res) => {
    console.log('bbbbbbbbb')
    try{
        res.status(200).send( { message: 'working'  } );
    }catch(e){
        res.status(400).send(e)
    }
} )

// LOGIN --------------------------------------

router.post('/auth/login', async (req,res)=>{
    // console.log(req.headers)
    try{
        const user = await User.findByCredentials(req.body.userName,req.body.password) //we create this function in the user model
        
        // const token = await user.generateAuthToken(); // create a token
        res.send( {user } ); //getPublicProfile is a method to hide info like password
    }catch(e){
        res.status(400).send();
    }
});

// LOG Out-------------------------------------------

router.post('/users/logout' , auth , async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter( (token)=>{
            return token.token !== req.token
        })
        await req.user.save();
        
        res.send();
    }catch(e){
        res.status(500).send();
    }
})

// LOGOUT ALL-----------------------------------------

router.post('/users/logoutAll', auth , async(req,res)=>{
    try{
        req.user.tokens = [];

        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;