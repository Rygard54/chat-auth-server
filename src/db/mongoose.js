const mongoose = require('mongoose');
console.log(process.env.MONGODB_URL)
setTimeout(()=>{
        
        mongoose.connect( process.env.MONGODB_URL , { // the first arg is the route to connect, the difference is that 
                useNewUrlParser: true,
                useCreateIndex: true, 
                useUnifiedTopology: true // idk but project ask for it
        } ).catch((error)=>{
                console.log('unable to connect database')
        })  
        var db = mongoose.connection;
        db.on('connecting', function() {
                console.log('connecting to MongoDB...');
        });
        
        db.on('error', function(error) {
                console.error('Error in MongoDb connection: ' + error);
                mongoose.disconnect();
        });
        db.on('connected', function() {
                console.log('MongoDB connected!');
        });
        db.once('open', function() {
                console.log('MongoDB connection opened!');
        });
        db.on('reconnected', function () {
                console.log('MongoDB reconnected!');
        });
        db.on('disconnected', function() {
                db.close();
                console.log('MongoDB disconnected!');
                
                setTimeout(()=>{
                        mongoose.connect(process.env.MONGODB_URL, {
                                useNewUrlParser: true,
                                useCreateIndex: true, 
                                useUnifiedTopology: true
                        }).catch(err => console.log('unable to reconect'));
                },5000)
        });
},15000)
