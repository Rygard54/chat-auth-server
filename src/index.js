const express = require('express');
const http = require('http')
const socketio = require ('socket.io')
const User = require('./models/user');


const port = process.env.PORT
const userRouter = require('./routers/user');


const app = express();
app.use(express.json());//tell express to parse the incoming json to an object

app.use(userRouter); // let us use the router from the other file

const server = http.createServer(app)

const io = socketio(server)

require('./db/mongoose');

io.on('connection',(socket)=>{
    socket.on('CREATENEWUSER', async (data) => {
        console.log(data)

        const user = new User(data) //we pass the object with the attributes, we allready have it in req object

        try{
            await user.save();

            // sendWelcomeEmail( user.email , user.userName ); //call the function to send an email to the new user

            const token = await user.generateAuthToken(); // generate the token to validate the created user 
            
        }catch(e){
           
        }
        // res.status(200).send('works');
    })
})

server.listen(port, () => {
    console.log('Auth Server is up on port ' + port);
});