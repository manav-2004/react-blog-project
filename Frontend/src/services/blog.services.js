import {Api} from '../api/Api'

class BlogServices{

    constructor(){
        this.api = new Api(import.meta.env.VITE_BLOG_API_BACKEND)
    }

    async getMyBlogs(){
        try {

            const response = await this.api.get("/getMyBlogs")
            return response

        } catch (error) {
            console.log("Error on fetching user blogs")
            throw error
        }
    }

    async getAllBlogs(){
        try {

            const response = await this.api.get("/getAllBlogs")
            return response

        } catch (error) {
            console.log("Error on fetching All blogs")
            throw error
        }
    }

    async getBlog(id){

        try {

            const data = {
                id
            }
            
            const response = await this.api.post("/getABlog", data)
            return response

        } catch (error) {
            console.log("Error getting the Blog")
            throw error
        }
    }
    
    async addBlog(data, file){

        if (!file){
            throw {
                statusCode : 400,
                message : "Featured image not sent"
            }
        }

        try {

            const formData = new FormData()

            for (const key in data){
                if (data.hasOwnProperty(key)){
                    formData.append(key, data[key])
                }
            }

            formData.append('featuredImage',file)
            
            const response = await this.api.post("/addBlog", formData, {
                "Content-Type" : "multipart/form-data"
            })
            return response

        } catch (error) {
            console.log("Error on uploading Blog")
            throw error
        }
    }

    async deleteBlog(id){
        try {
            
            const data = { id }
            const response = await this.api.post("/deleteBlog",data)
            return response
            
        } catch (error) {
            console.log("Error on deleting")
            throw error
        }
    }

    async toggleStatus(id, data){
        try {
            
            data.id = id
            const response = await this.api.patch("/toggleStatus",data)
            return response

        } catch (error) {
            console.log("Error on toggling Status")
            throw error
        }
    }

    async editBlog(id, data){
        try {
            
            data.id = id
            const response = await this.api.patch("/editBlog",data)
            return response

        } catch (error) {
            console.log("Error on Editing blog")
            throw error
        }
    }

    async editImage(id, file){
        if (!file){
            throw {
                statuscode : 400,
                message : "Featured Image is required"
            }
        }
        try {

            const formData = new FormData()
            formData.append('id',id)
            formData.append('featuredImage',file)

            const response = await this.api.patch("/editBlogImage", formData, {
                "Content-Type" : "multipart/form-data"
            })
            return response
            
        } catch (error) {
            console.log("Error on updating Image")
            throw error
        }
    }

}

export const Blog = new BlogServices()