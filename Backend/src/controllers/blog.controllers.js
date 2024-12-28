import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {Blog} from '../models/blog.model.js'
import { User } from '../models/user.model.js'
import {deleteFromCloudinary, uploadOnCloudinary} from '../utils/cloudinary.js'
import mongoose from 'mongoose'



const getMyBlogs = asyncHandler(async(req, res)=>{

    const response = await User.aggregate([

        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup : {
                from : "blogs",
                localField : "blogs",
                foreignField : "_id",
                as : "blogs"
            }
        },
        {
            $project : {
                fullname : 1,
                email : 1,
                username : 1,
                avatar : 1,
                blogs : 1

            }
        }
    ])

    if (!response.length){
        throw new ApiError(500, "Error on retrieving blogs from database")
    }

    res.status(200)
    .json(
        new ApiResponse(200,response[0],"Blogs sent successfully")
    )

})

const getAllBlogs = asyncHandler(async(req, res)=>{

    const allBlogs = await Blog.aggregate([
        {
            $match : {
                status : true
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner",
                pipeline : [
                    {
                        $project : {
                            fullname : 1,
                            email : 1,
                            username : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                owner : {
                    $arrayElemAt : ["$owner",0]
                }
            }
        }
    ])

    res.status(200)
    .json(
        new ApiResponse(200,{
            data : allBlogs
        },"blogs sent successfully")
    )

})

const addBlog = asyncHandler(async(req, res)=>{

    const user = req.user

    const {title, content, status, slug} = req.body

    if (
        [title,content,status,slug].some((field)=>field === undefined)
    ){
        throw new ApiError(400, "All fields are required")
    }

    const featuredImageLocalPath = req.file?.path

    if (!featuredImageLocalPath){

        throw new ApiError(400,"featured image is required")
    }

    const featuredImage = await uploadOnCloudinary(featuredImageLocalPath)

    const blog = await Blog.create({

        title,
        slug,
        content,
        featuredImage : featuredImage.url,
        status,
        owner : user._id

    })

    if (!blog){
        throw new ApiError(500,"could not upload your blog")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $push : {
                blogs : blog._id
            }
        },
        {
            new : true
        }
    )
    if (!updatedUser){
        throw new ApiError(500,"could not update user's blogs")
    }

    res.status(201)
    .json(
        new ApiResponse(201,blog,"blog created successfully")
    )

})

const deleteBlog = asyncHandler(async(req, res)=>{

    const {id} = req.body

    if (!id){
        throw new ApiError(400,"Blog id is required")
    }

    const deleted = await Blog.findByIdAndDelete(id)

    if (!deleted){
        throw new ApiError(404,"couldn't find blog with given")
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $pull : {
                blogs : id
            }
        },
        {
            new : true
        }

    )


    res.status(200)
    .json(
        new ApiResponse(200,{},"blog deleted")
    )
})

const toggleStatus = asyncHandler(async(req, res)=>{

    const {id} = req.body

    if (!id){
        throw new ApiError(400,"Blog id is required")
        
    }

    const user = await Blog.findById(id)

    if (!user){
        throw new ApiError(404,"couldn't find blog with given id")
    }

    const updatedStatus = await Blog.findByIdAndUpdate(
        id,
        {
           $set : {
                status : !user.status
           }
        },
        {
            new : true
        }
    ).select("-content -featuredImage -owner")

    res.status(200)
    .json(
        new ApiResponse(200, updatedStatus, "status updated Successfully")
    )

})

const editBlog = asyncHandler(async(req, res)=>{

    let data = req.body//data would be an object

    const id = data?.id

    if (!id){
        throw new ApiError(400,"Blog id is required")
    }
    
    delete data.id
    
    const updatedData = await Blog.findByIdAndUpdate(
        id,
        {
            $set : data
        },
        {
            new : true
        }
    )

    
    if (!updatedData){
        throw new ApiError(404,"couldn't find blog with given id")
    }

    res.status(200)
    .json(
        new ApiResponse(200,updatedData,"Blog updated successfully")
    )

})

const editBlogImage = asyncHandler(async(req, res)=>{

    const {id} = req.body

    if (!id){
        throw new ApiError(400,"Blog id is required")
    }

    const localPath = req.file?.path

    if (!localPath){
        throw new ApiError(400,"featured image is required for updation")
    }

    const image = await uploadOnCloudinary(localPath)

    const oldData = await Blog.findById(id)
    
    if (!oldData){
        throw new ApiError(404,"couldn't find blog with given id")
    }

    await deleteFromCloudinary(oldData?.featuredImage)

    await Blog.findByIdAndUpdate(
        id,
        {
            $set : {
                featuredImage : image.url
            }
        }
    )

    res.status(200)
    .json(
        new ApiResponse(200,{},"Image updated Successfully")
    )

})

const getABlog = asyncHandler(async(req, res)=>{

    const {id} = req.body

    if (!id){
        throw new ApiError(400, "Id is required")
    }

    const blog = await Blog.findById(id)

    if (!blog){
        throw new ApiError(404, "Could not find a blog with given id")
    }

    res.status(200)
    .json(
        new ApiResponse(200,blog,"Blog sent successfully")
    )

})

export {
    getAllBlogs,
    addBlog,
    deleteBlog,
    toggleStatus,
    editBlog,
    editBlogImage,
    getMyBlogs,
    getABlog
}