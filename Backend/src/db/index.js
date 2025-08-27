import mongoose from "mongoose"
import { DbName } from "../constants.js"

const dbUrl = process.env.MONGODB_URL

export const connectdb = async ()=>{
    try {
        
        const mongooseConnectionInstance = await mongoose.connect(`${dbUrl}/${DbName}`)
        console.log("MongoDb Connection Success !!!")

    } catch (error) {
        throw error
        // process.exit(1)
    }
}