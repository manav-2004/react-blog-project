import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({

    title : {
        type : String,
        required : true,
        trim : true,        
    },
    content : {
        type : String,
        required : true        
    },
    featuredImage : {
        type : String,
        required : true,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        unique : true
    },
    status : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})

export const Blog = mongoose.model('Blog',blogSchema)