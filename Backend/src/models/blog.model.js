import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({

    title : {
        type : String,
        required : true,
        trim : true,        
    },
    slug : {
        type : String,
        required : true
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
    },
    category : {
        type : String,
        required : true,
        enum : ["Tech","Lifestyle","Business","Education","Entertainment","Health","Others"]
    },
    status : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})

export const Blog = mongoose.model('Blog',blogSchema)