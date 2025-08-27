import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import {Temp} from "../models/resetPass.model.js"
import {deleteFromCloudinary, uploadOnCloudinary} from '../utils/cloudinary.js'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import mongoose, { Mongoose } from 'mongoose'
import crypto from "crypto"
import { sendMail } from '../utils/emailService.js'
import { oAuth2Client } from '../utils/GoogleLogin.js'
import axios from "axios"


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

    // const avatarLocalPath = req.file?.path

    // let avatar = {}
    // if (fs.existsSync(avatarLocalPath)){
    //    avatar = await uploadOnCloudinary(avatarLocalPath)
    // }

    const _user = await User.create({
        fullname,
        username,
        password,
        email,
        passwordSet : true,
        authType : 'normal'
    })

    const registeredUser = await User.findById(_user._id).select(
        "-password"
    )

    res.status(201)
    .json(
        new ApiResponse(201,registeredUser,"User created successfully")
    )

})


const googleRegister = asyncHandler(async (req, res)=>{

    const {code} = req.query

    if (!code){
        throw new ApiError(400, "Verification code not sent")
    }
    
    const {tokens} = await oAuth2Client.getToken(code)
    
    if (!tokens){
        throw new ApiError(500, "Error in oAuth Token generation")
    }

    const { data } = await axios.get(`${process.env.OAUTH_URL}=${tokens.access_token}`)
    
    if (!data){
        throw new ApiError(500, "Error in oAuth Login")
    }

    //name and email
    const existingUser = await User.findOne({email : data.email})

    if (existingUser){
        throw new ApiError(400, "User already exist")
    }

    let user = await User.create({
        fullname : data.name,
        email : data.email,
        passwordSet : false,
        authType : 'google'  
    })


    if (!user){
        throw new ApiError(500, "user could not be created")
    }

    const jwtTokens = await generateRefreshAndAccessToken(user._id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      };

    user = user.toObject()
    
    delete user?.password
    delete user?.refreshToken

    res.status(201)
    .cookie("accessToken",jwtTokens.accessToken, options)
    .cookie("refreshToken",jwtTokens.refreshToken, options)
    .json(
        new ApiResponse(201,user,"Signed Up successfully")
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

    let user = await User.findOne({
        email
    })

    if (!user){
        throw new ApiError(404,"user not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect){
        throw new ApiError(400, "password is wrong")
    }

    const tokens = await generateRefreshAndAccessToken(user._id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        // domain: 'react-blog-project.onrender.com',
        // path: '/',
      };

    user = user.toObject()
    
    delete user?.password
    delete user?.refreshToken

    res.status(200)
    .cookie("accessToken",tokens.accessToken, options)
    .cookie("refreshToken",tokens.refreshToken, options)
    .json(
        new ApiResponse(200,user,"loggedIn successfully")
    )

})


const googleLogin = asyncHandler(async (req, res)=>{

    const {code} = req.query

    //validate the code
    if (!code){
        throw new ApiError(400, "Validation code not sent")
    }

    const { tokens } = await oAuth2Client.getToken(code)


    if (!tokens){
        throw new ApiError(500, "Error in oAuth Token generation")
    }

    const {data} = await axios.get(`${process.env.OAUTH_URL}=${tokens.access_token}`)

    if (!data){
        throw new ApiError(500, "Error in oAuth Login")
    }

    const email = data.email

    let user = await User.findOne({email})


    if (!user){
        throw new ApiError(404, "user not found")
    }


    const jwtTokens = await generateRefreshAndAccessToken(user._id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      };

    user = user.toObject()
    
    delete user?.password
    delete user?.refreshToken

    res.status(200)
    .cookie("accessToken",jwtTokens.accessToken, options)
    .cookie("refreshToken",jwtTokens.refreshToken, options)
    .json(
        new ApiResponse(200,user,"loggedIn successfully")
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

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        // domain: 'react-blog-project.onrender.com',
        // path: '/',
      };

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user loged out succssfully")
    )

})

const refresh_tokens = asyncHandler(async(req, res)=>{
    

    const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","")

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
        console.log(user.refreshToken)
        console.log(incomingRefreshToken)
        throw new ApiError(401,"Refresh Token is expired")
    }

    const {refreshToken, accessToken} = await generateRefreshAndAccessToken(user._id)

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : 'None'
    }

    res.status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
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
        throw new ApiError(400,"Both fields are required")
    }
    
    if (newPassword === ""){
        throw new ApiError(400,"New passowrd can not be empty")
    }

    const user = await User.findById(req.user._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect){
        throw new ApiError(400,"current password is not correct")
    }

    user.password = newPassword
    user.save()

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

const getUserData = asyncHandler(async(req, res)=>{

    const {id} = req.body

    if (!id){
        throw new ApiError(400, "User id not sent")
    }

    const data = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup : {
                from : "blogs",
                localField : "blogs",
                foreignField : "_id",
                as : "blogs",
                pipeline : [

                    {
                        $match : {
                            status : true
                        }
                    },
                    {
                        $project : {
                            _id : 1,
                            title : true,
                            featuredImage : true
                        }
                    }
                ] 
            }
        },
        {

            $project : {
                username : 1,
                fullname : 1,
                blogs : 1,
                email : 1,
                avatar : 1,
                status : 1
            }

        }
    ])

    if (data.length == 0){
        throw new ApiError(400, "Id not found")
    }

    res.status(200)
    .json(
        new ApiResponse(200, data[0], "Data Sent Successfully")
    )
})

const updateDetails = asyncHandler(async(req, res)=>{

    const id = req.user._id
    const fields = req.body

    const usernameCheck = await User.findOne({username : fields?.username})
    //if i found a username and that username id is not equal to current user id that means
    //this username belongs to another user that is already taken.
    if (usernameCheck && !usernameCheck?._id.equals(id)){
        throw new ApiError(400,"Username already exist")
    }
    
    const emailCheck = await User.findOne({email : fields?.email})
    if (emailCheck && !emailCheck?._id.equals(id)){
        throw new ApiError(400,"Email already exist")
    }


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
    if (oldUser.avatar){
        await deleteFromCloudinary(oldUser?.avatar)
    }

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
    ).select("-password -refreshToken")

    if (!updatedUser){
        throw new ApiError(500,"could not update user's avatar")
    }

    res.status(200)
    .json(
        new ApiResponse(200,updatedUser,"image uploaded successfully")
    )

})

const fetchStatus = asyncHandler(async(req, res)=>{

    const id = req.body.id

    if (!id){
        throw new ApiError(400, "Id not sent")
    }

    const data = await User.findById(id).select("status")

    if (!data){
        throw new ApiError(400, "Id not found")
    }

    res.status(200)
    .json(
        new ApiResponse(200, data, "status sent successfully")
    )

})

const toggleStatus = asyncHandler(async(req, res)=>{

    const {status} = req.body

    await User.findByIdAndUpdate(req.user._id, {
        $set : {
            status
        }
    })

    res.status(200).json(
        new ApiResponse(200, {}, "Status Changed Successfully")
    )
})

const sendResetMail = asyncHandler(async (req, res)=>{


    const { email } = req.body

    if (!email){
        throw new ApiError(400, "Email is required")
    }

    const check = await User.findOne({
        email
    }).select("-password -refreshToken")

    if (!check){
        throw new ApiError(400, "User Doesn't Exist")
    }

    //user exist
    //generate a token

    const token = crypto.randomBytes(32).toString("hex")

    const temp = await Temp.create({
        user : check._id,
        token
    })

    if (!temp){
        throw new ApiError(500, "Internal server error")
    }

    await sendMail(email,token)


    res.status(200)
    .json(
        new ApiResponse(200, {}, "Email sent successfully")
    )
})

const verifyToken = asyncHandler(async(req, res)=>{

    const { token } = req.body

    if (!token){
        throw new ApiError(400, "token not received")
    }

    const check = await Temp.findOne({
        token
    })

    if (!check){
        throw new ApiError(404, "Page not found")
    }


    res.status(200)
    .json(
        new ApiResponse(200, {}, "token Validated")
    )
})

const resetPassword = asyncHandler(async (req, res)=>{

    const {token, password} = req.body

    if (!token || !password){
        throw new ApiError(400, "Both fields are required")
    }

    const check = await Temp.findOne({
        token
    })

    if (!token){
        throw new ApiError(400, "token expired")
    }

    const user = await User.findOne({
        _id : check.user
    }).select("-password -refreshToken")

    if (!user){
        throw new ApiError(400, "Couldn't locate user")
    }

    await Temp.findByIdAndDelete(check._id)

    user.password = password
    await user.save()

    res.status(200)
    .json(
        new ApiResponse(200, {}, "Password updated successfully")
    )

})

export{
    registerUser,
    loginUser,
    logoutUser,
    refresh_tokens,
    changePassword,
    getUser,
    updateAvatar,
    updateDetails,
    getUserData,
    fetchStatus,
    toggleStatus,
    sendResetMail,
    verifyToken,
    resetPassword,
    googleLogin,
    googleRegister
}



