import {Api} from '../api/Api.js'

class AuthServices{

    constructor(){
        
        this.api = new Api(import.meta.env.VITE_USER_API_BACKEND)
    }
    
    async register(data, file=undefined){
        try {

            let headers = {}
            let formData = data
            if (file){
                console.log("file received")
                formData = new FormData()

                for (const key in data){
                    if (data.hasOwnProperty(key)){
                        formData.append(key, data[key])
                    }
                }
    
                formData.append('avatar',file)
                headers = {
                    "Content-Type" : "multipart/form-data"
                }
            }

            const response = await this.api.post("/register",formData, headers)
            
            delete data.fullname
            delete data.username
            await this.login(data)
            
            return response
            
        } catch (error) {
            console.log("Error registering user")
            throw error
        }
    }

    async googleRegister(code){
        try {
            
            const response = await this.api.get(`/googleRegister?code=${code}`)
            return response

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async login(data){
        try {
            
            const response = await this.api.post("/login", data)
            return response

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async googleLogin(code){
        try {
            
            const response = await this.api.get(`/googleLogin?code=${code}`)
            return response

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getUser(){
        try {

            const response = await this.api.get("/getUser")
            return response
            
        } catch (error) {

            throw error
        }
    }

    async getUserData(data){
        try {

            const response = await this.api.post("/getUserData", data)
            return response
            
        } catch (error) {

            throw error
        }
    }


    async fetchStatus(data){
        try {

            const response = await this.api.post("/fetchStatus", data)
            return response
            
        } catch (error) {

            console.log("Error on fetching status")
            throw error
        }
    }

    async toggleStatus(data){
        try {

            const response = await this.api.post("/toggleStatus", data)
            return response
            
        } catch (error) {

            console.log("Error in toggling status")
            throw error
        }
    }

    async logout(){
        try {
            
            const response = await this.api.get("/logout")
            return response

        } catch (error) {

            console.log("Error on logout")
            throw error
        }
    }

    async changePassword(data){
        try {
            
            const response = await this.api.post("/changePassword",data)
            return response

        } catch (error) {

            console.log("Error on password change")
            throw error
        }
    }

    async refreshTokens(){
        try {
            
            const response = await this.api.get("/refreshTokens")
            return response

        } catch (error) {
            
            console.log("Error on refreshing tokens")
            throw error
        }
    }

    async updateDetails(data){
        try {
            
            const response = await this.api.patch("/updateDetails",data)
            return response

        } catch (error) {

            console.log("Error on updating details")
            throw error
        }
    }

    async sendMail(data){
        try {
            
            const response = await this.api.post("/sendMail",data)
            return response

        } catch (error) {

            console.log("Error on sending Mail")
            throw error
        }
    }
    
    async verifyToken(data){
        try {
            
            const response = await this.api.post("/verifyToken",data)
            return response

        } catch (error) {

            console.log("Error on Verifying Token")
            throw error
        }
    }

    async resetPassword(data){
        try {
            
            const response = await this.api.post("/resetPassword",data)
            return response

        } catch (error) {

            console.log("Error on Reseting Password")
            throw error
        }
    }

    async updateAvatar(file){
        if (!file){
            throw {
                statusCode : 400,
                message : "Didn't receive avatar"
            }
        }

        const formData = new FormData()

        formData.append('avatar',file)

        try {
            
            const response = await this.api.patch("/updateAvatar",formData,{
                "Content-Type" : "multipart/form-data"
            })
            return response

        } catch (error) {

            console.log("Error on updating avatar")
            throw error
        }
    }
}

export const Authorize = new AuthServices() 