import mongoose from "mongoose";


const schema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    token : {
        type : String,
        default : ""
    },

    createdAt : {
        type : Date,
        default : Date.now,
        expires : '1h'
    }

})

export const Temp = mongoose.model('Temp', schema)