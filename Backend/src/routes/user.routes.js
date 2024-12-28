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
        updateDetails
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/register").post(upload.single("avatar"),registerUser)

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").get(isLoggedIn,logoutUser)

router.route("/refreshTokens").get(refresh_tokens)

router.route("/changePassword").post(isLoggedIn,changePassword)

router.route("/getUser").get(isLoggedIn,getUser)

router.route("/updateDetails").patch(isLoggedIn,updateDetails)

router.route("/updateAvatar").patch(isLoggedIn,upload.single("avatar"),updateAvatar)

export default router