import {google} from "googleapis"
import dotenv from "dotenv"

dotenv.config()



const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET   
const redirectUrl = process.env.REDIRECT_URL

export const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
)