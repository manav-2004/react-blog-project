import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {Blog} from '../models/blog.model.js'
import {deleteFromCloudinary, uploadOnCloudinary} from '../utils/cloudinary.js'


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

    const {title, content, status} = req.body

    if (
        [title,content,status].some((field)=>field.trim()==="")
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
        content,
        featuredImage : featuredImage.url,
        status,
        owner : user._id

    })

    if (!blog){
        throw new ApiError(500,"could not upload your blog")
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

    await Blog.findByIdAndDelete(id)

    res.status(200).json(200,{},"blog deleted")
})

const toggleStatus = asyncHandler(async(req, res)=>{

    const {id} = req.body

    if (!id){
        throw new ApiError(400,"Blog id is required")
    }

    const updatedStatus = await Blog.findByIdAndUpdate(
        id,
        {
           $set : {
                status : {
                    $cond : {
                        if : {
                            $eq : ["$status",true]
                        },
                        then : false,
                        else : true
                    }
                }
           }
        },
        {
            new : true
        }
    ).select("-content -featuredImage -owner")


    if (!updatedStatus){
        throw new ApiError(500, "server error on updating status")
    }

    res.staus(200)
    .json(
        new ApiResponse(200, updatedStatus, "status updated Successfully")
    )

})

const editBlog = asyncHandler(async(req, res)=>{

    let {id,title,content} = req.body

    if (!id){
        throw new ApiError(400,"Blog id is required")
    }
    
    if (!title && !content){
        throw new ApiError(400,"title and content is required")
    }

    const updatedData = await Blog.findByIdAndUpdate(
        id,
        {
            $set : {
                title,
                content
            }
        },
        {
            new : true
        }
    )

    res.status(200)
    .json(
        new ApiResponse(200,{},"Blog updated successfully")
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

    await deleteFromCloudinary(oldData.featuredImage)

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

export {
    getAllBlogs,
    addBlog,
    deleteBlog,
    toggleStatus,
    editBlog,
    editBlogImage
}