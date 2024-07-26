import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import {deleteFromCloudinary, uploadOnCloudinary} from '../utils/cloudinary.js'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'


const generateRefreshAndAccessToken = async (id)=>{

    try {
        
        const user = await User.findById(id).select(
            "-password"
        )

        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken

        user.save({
            validateBeforeSave : false
        })

        return {
            refreshToken,
            accessToken
        }

    } catch (error) {
        throw error
    }

}

const registerUser = asyncHandler(async(req, res)=>{

    const {fullname, email, username, password} = req.body

    if (
        [fullname, email, username, password].some(field=> field===undefined)
    ){
        throw new ApiError(400, "All fields are required")
    }

    if (
        [fullname, email, username, password].some(field=> field.trim()==="")
    ){
        throw new ApiError(400, "Some fields are empty")
    }

    const user = await User.findOne({
        $or : [
            {
                username
            },
            {
                email
            }
        ]
    })

    if (user){
        throw new ApiError(409,"user already exists")
    }

    const avatarLocalPath = req.file?.path

    let avatar = {}
    if (fs.existsSync(avatarLocalPath)){
       avatar = await uploadOnCloudinary(avatarLocalPath)
    }

    const _user = await User.create({
        fullname,
        username,
        password,
        email,
        avatar : avatar?.url || ""
    })

    const registeredUser = await User.findById(_user._id).select(
        "-password"
    )

    res.status(200)
    .json(
        new ApiResponse(200,registeredUser,"User created successfully")
    )

})

const loginUser = asyncHandler(async(req, res)=>{

    const {email,password} = req.body

    if (
        [email, password].some(field=>field===undefined)
    ){
        throw new ApiError(400,"All fields are required")
    }

    if (
        [email, password].some(field=>field.trim()==="")
    ){
        throw new ApiError(400,"one or both field sent is empty")
    }

    const user = await User.findOne({
        email
    })

    if (!user){
        throw new ApiError(404,"user not found")
    }

    const tokens = await generateRefreshAndAccessToken(user._id)

    const options = {
        httpOnly : true,
        secure : true
    }

    res.status(200)
    .cookie("accessToken",tokens.accessToken, options)
    .cookie("refreshToken",tokens.refreshToken, options)
    .json(
        new ApiResponse(200,{
            refreshToken : tokens.refreshToken,
            accessToken : tokens.accessToken
        },"loggedIn successfully")
    )

})

const logoutUser = asyncHandler(async(req, res)=>{

    const user = req.user

    const updated = await User.findByIdAndUpdate(
        user._id,
        {
            $set : {
                refreshToken : ""
            }
        }
    )
    if (!updated){
        throw new ApiError(500,"could not logout")
    }

    res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200,{},"user loged out succssfully")
    )

})

const refresh_tokens = asyncHandler(async(req, res)=>{

    const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authorization").replace("Bearer ","")

    if (!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Requst")
    }

    const decodedValue = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedValue._id).select(
        "-password"
    )

    if (!user){
        throw new ApiError(401,"Refresh Token is not correct")
    }

    if (user.refreshToken !== incomingRefreshToken){
        throw new ApiError(401,"Refresh Token is expired")
    }

    const {refreshToken, accessToken} = generateRefreshAndAccessToken(user._id)

    const options = {
        httpOnly : true,
        secure : true
    }

    res.status(200)
    .cookie("accessToken",tokens.accessToken, options)
    .cookie("refreshToken",tokens.refreshToken, options)
    .json(
        new ApiResponse(200,{
            refreshToken,
            accessToken
        },"New Tokens generated successfully successfully")
    )



})

const changePassword = asyncHandler(async(req, res)=>{

    const {oldPassword, newPassword} = req.body

    if (
        [oldPassword, newPassword].some(field=> field === undefined)
    ){
        throw new ApiError(400,"Both fields are rquired")
    }
    
    if (newPassword === ""){
        throw new ApiError(400,"New passowrd can't be empty")
    }

    const user = await User.findById(req.user._id)

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect){
        throw new ApiError(400,"current password is not correct")
    }

    const updated = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                password : newPassword
            }
        },
        {
            new : true
        }
    )
    if (!updated){
        throw new ApiError(500,"could not change password")
    }

    res.status(200)
    .json(
        new ApiResponse(200,{},"password updated successfully")
    )

})

const getUser = asyncHandler(async(req, res)=>{

    res.status(200)
    .json(
        new ApiResponse(200,req.user,"User sent successfully")
    )

})

const updateDetails = asyncHandler(async(req, res)=>{

    const id = req.user._id
    const fields = req.body

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $set : fields
        },
        {
            new : true
        }
    )

    if (!updatedUser){
        throw new ApiError(500, "could not update user")
    }

    res.status(200)
    .json(
        new ApiResponse(200,{},"user updated successfully")
    )

})

const updateAvatar = asyncHandler(async(req, res)=>{

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath){
        throw new ApiError(400,"avatar not sent")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)


    const oldUser = await User.findById(req.user._id).select("-password -refreshToken")
    await deleteFromCloudinary(oldUser?.avatar)

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                avatar : avatar.url
            }
        },
        {
            new : true
        }
    )

    if (!updatedUser){
        throw new ApiError(500,"could not update user's avatar")
    }

    res.status(200)
    .json(
        new ApiResponse(200,{},"image uploaded successfully")
    )

})

const getMyBlogs = asyncHandler(async(req, res)=>{

    const response = await User.aggregate([

        {
            $match : {
                _id : mongoose.Types.ObjectId(req.user._id)
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


export{
    registerUser,
    loginUser,
    logoutUser,
    refresh_tokens,
    changePassword,
    getMyBlogs,
    getUser,
    updateAvatar,
    updateDetails
}