import axios from 'axios'

export class Api{

    constructor(baseUrl){
        
        this.client = axios.create({
            baseURL : baseUrl,
            headers : {
                "Content-Type" : "application/json"
            },
            withCredentials : true
        })

    }

    async post(endpoint, data, headers = {}){
        try {

            const response = await this.client.post(endpoint, data , {headers})
            return response.data

        } catch (error) {
            throw error.response ? error.response.data : new Error("Network Error")
        }
    }

    async get(endpoint, headers = {}){
        try {

            const response = await this.client.get(endpoint, {headers})
            return response.data

        } catch (error) {
            throw error.response ? error.response.data : new Error("Network Error")
        }
    }

    async patch(endpoint, data, headers = {}){
        try {

            const response = await this.client.patch(endpoint, data , {headers})
            return response.data

        } catch (error) {
            throw error.response ? error.response.data : new Error("Network Error")
        }
    }

}
