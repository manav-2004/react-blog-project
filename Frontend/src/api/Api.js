import axios from 'axios';


export class Api {

    constructor(baseURL) {
        this.client = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });

        this.client.interceptors.response.use(
            (res) => res,

            async (err) => {
                const originalReq = err.config;

                if (err.response?.status === 401 && !originalReq?._retry) {

                    originalReq._retry = true;
                    
                    try {
                    
                        console.log("sent request to refresh access_token");
                    
                        await axios.get(`${import.meta.env.VITE_USER_API_BACKEND}/refreshTokens`,{withCredentials : true});
                    
                        return this.client(originalReq);
                    
                    } catch (error) {

                        console.log(error)

                        if (window.location.pathname !== "/"){
                            window.location.href = "/"
                        }
                        
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(err);
            }
        )
    }

    async post(endpoint, data, headers = {}) {
        try {
            const response = await this.client.post(endpoint, data, { headers });
            return response.data;
        } catch (error) {
            // Pass the custom error response back
            throw error;
        }
    }

    async get(endpoint, headers = {}) {
        try {
            const response = await this.client.get(endpoint, { headers });
            return response.data;
        } catch (error) {
            // Pass the custom error response back
            throw error;
        }
    }

    async patch(endpoint, data, headers = {}) {
        try {
            const response = await this.client.patch(endpoint, data, { headers });
            return response.data;
        } catch (error) {
            // Pass the custom error response back
            throw error;
        }
    }
}
