import axios from 'axios';
import {Api} from '../api/Api.js'

const refreshPage = ()=>{
    window.location.reload()
}


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

    async login(data){
        try {
            
            const response = await this.api.post("/login", data)
            return response

        } catch (error) {
            console.log("Error logging in")
            throw error
        }
    }

    async getUser(){
        try {

            const response = await this.api.get("/getUser")
            return response
            
        } catch (error) {
            if (error.response.data.statusCode == 401){
                await this.refreshTokens()
                await this.getUser()
                refreshPage()
            }
            throw error
        }
    }

    async getUserData(data){
        try {

            const response = await this.api.post("/getUserData", data)
            return response
            
        } catch (error) {
            if (error.response.data.statusCode == 401){
                await this.refreshTokens()
                await this.getUser()
                refreshPage()
            }
            throw error
        }
    }


    async fetchStatus(data){
        try {

            const response = await this.api.post("/fetchStatus", data)
            return response
            
        } catch (error) {
            if (error.response.data.statusCode == 401){
                await this.refreshTokens()
                await this.getUser()
                refreshPage()
            }
            throw error
        }
    }

    async toggleStatus(data){
        try {

            const response = await this.api.post("/toggleStatus", data)
            return response
            
        } catch (error) {
            if (error.response.data.statusCode == 401){
                await this.refreshTokens()
                await this.getUser()
                refreshPage()
            }
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
            if (error.response.data.statusCode == 401){
                refreshPage()
            }
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
            if (error.response.data.statusCode == 401){
                refreshPage()
            }
            console.log("Error on updating details")
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
            if (error.response.data.statusCode == 401){
                refreshPage()
            }
            console.log("Error on updating avatar")
            throw error
        }
    }
}

export const Authorize = new AuthServices() 