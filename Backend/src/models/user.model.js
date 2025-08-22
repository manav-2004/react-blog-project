import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({

    fullname : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true
    },
    username : {
        type : String,
        default : "",
        lowercase : true,
        unique : true,
        trim : true,
        index : true
    },
    password : {
        type : String,
    },
    avatar : {
        type : String,
        default : ""
    },
    blogs : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'Blog'
        }
    ],
    refreshToken : {
        type : String,
        default : ""
    },
    status : {
        type : Boolean,
        default : false
    },
    passwordSet : {
        type : Boolean,
        required : true
    }

},{timestamps : true})

userSchema.pre('save',async function(next){
    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateRefreshToken = function(){
    const token = jwt.sign({

        _id : this._id,

    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })

    return token
}

userSchema.methods.generateAccessToken = function(){
    const token = jwt.sign({

        _id : this._id,
        email : this.email,
        username : this.username

    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })

    return token
}


export const User = mongoose.model('User',userSchema)