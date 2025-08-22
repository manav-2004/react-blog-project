import { Router } from "express";
import { upload } from '../middlewares/multer.middleware.js'
import {
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
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/register").post(upload.single("avatar"),registerUser)

router.route("/googleRegister").get(googleRegister)

router.route("/login").post(loginUser)

router.route("/googleLogin").get(googleLogin)

router.route("/getUserData").post(getUserData)

router.route("/fetchStatus").post(fetchStatus)

router.route("/sendMail").post(sendResetMail)

router.route("/verifyToken").post(verifyToken)

router.route("/resetPassword").post(resetPassword)

router.route("/refreshTokens").get(refresh_tokens)

//secured routes

router.route("/logout").get(isLoggedIn,logoutUser)

router.route("/changePassword").post(isLoggedIn,changePassword)

router.route("/getUser").get(isLoggedIn,getUser)

router.route("/toggleStatus").post(isLoggedIn, toggleStatus)

router.route("/updateDetails").patch(isLoggedIn,updateDetails)

router.route("/updateAvatar").patch(isLoggedIn,upload.single("avatar"),updateAvatar)

export default router