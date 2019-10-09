const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');



const userSchema = new mongoose.Schema({  
    //By default mongoose already converts this object to a schema but with this we can use middleware and helps for log in
    userName:{
        //here we can set the type and do some requirements for validations 
        type:String,
        unique: true,
        required:true,
        trim: true //remove all white space before and after 
    },
    email:{
        type:String,
        unique:true, //prevent the value to be repeted in other documents
        required:true,
        trim:true,
        lowercase:true,
        validate(value){ 
            if( !validator.isEmail(value) ){
                throw new Error('Invalid email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){ 
            if (value.toLowerCase().includes('password')){
                throw new Error('password can not contain "password"')
            }
        }
    }
    // tokens: [{ //this help us to have  more that one token so the user can be loged in more than one device
    //     token:{

    //         type:String
    //     }
    // }]
}, {
    timestamps:true //add 2 fields when it was created and last update
});

// generate JSON Web Token------------------------------------------------

userSchema.methods.generateAuthToken = async function(){ //method lives in the instances unlike statics that live in the model
    const user = this;

    const token = JWT.sign( { _id : user._id.toString() },process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token: token });

    await user.save();

    return token;
}

// Public Object --------------------------------------------------------

userSchema.methods.toJSON =  function(){
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.password;//delete the password so we don't show it to the user
    delete userObject.tokens;//delete tokens since they're useless to user

    return userObject;
}

// Check credentials for login ----------------------------------

userSchema.statics.findByCredentials = async (userName,password) => {
    const user = await User.findOne( { userName:userName } )

    if( !user ){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user;
}

userSchema.statics.findSimpleUser = async (userID) => {
    const user = await User.findOne( { _id: userID } )

    const publicUser = {
        userName:user.userName,
    }
    return publicUser;
}

// FIND MY USER (RETURN A PUBLIC USER)

// userSchema.statics.findMyUser = async (userID, token) => {
//     const user = await User.findOne( { _id: userID } )

//     const publicUser = {
//         userName:user.userName,
//         email:user.email,
//         profilePic:user.profilePic,
//         contactList:user.contactList
//     }
//     return publicUser;
// }

// HASH PASSWORD --------------------------------------------
userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){ 
        //this check if the user is modifying the password, it will be true when creating and modifying 
        user.password = await bcrypt.hash(user.password, 8 );
    }

    next() //if we don't call next it wont never know that we are finish and will keep waiting

}) //the first arg is the event and the second is the function to run
//pre method is to execute something before something, post on the other hand will execute once the event has happen


const User = mongoose.model('User',userSchema);

module.exports = User;