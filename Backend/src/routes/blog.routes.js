import { Router } from "express";
import {
    getAllBlogs,
    addBlog,
    deleteBlog,
    toggleStatus,
    editBlog,
    editBlogImage,
    getMyBlogs,
    getABlog
} from '../controllers/blog.controllers.js'

import {isLoggedIn} from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

const router = Router()

router.route("/getMyBlogs").get(isLoggedIn,getMyBlogs)

router.route("/getABlog").post(getABlog)

router.route("/getAllBlogs").get(getAllBlogs)

router.route("/addBlog").post(isLoggedIn,upload.single("featuredImage"),addBlog)

router.route("/deleteBlog").post(isLoggedIn,deleteBlog)

router.route("/toggleStatus").patch(isLoggedIn,toggleStatus)

router.route("/editBlog").patch(isLoggedIn,editBlog)

router.route("/editBlogImage").patch(isLoggedIn,upload.single("featuredImage"),editBlogImage)

export default router