import nodemailer from "nodemailer"
import {ApiError} from "./ApiError.js"


export const sendMail = async (email, token)=>{

    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.MAIL,
            pass : process.env.APP_PASS
        }
    })

    const url = `${process.env.ORIGIN}/reset-password/${token}`


    try {
        
        await transporter.sendMail({
            from : `John Doe ${process.env.MAIL}`,
            to : email,
            subject : "Reset Password",
            html : `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .container {
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .header h1 {
                            color: #2c3e50;
                            margin-bottom: 10px;
                        }
                        .content {
                            margin-bottom: 30px;
                        }
                        .reset-button {
                            display: inline-block;
                            background-color: #3498db;
                            color: white;
                            padding: 12px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .reset-button:hover {
                            background-color: #2980b9;
                        }
                        .fallback-url {
                            background-color: #f8f9fa;
                            border: 1px solid #dee2e6;
                            border-radius: 5px;
                            padding: 15px;
                            margin-top: 20px;
                            word-break: break-all;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            font-size: 12px;
                            color: #666;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border: 1px solid #ffeaa7;
                            color: #856404;
                            padding: 15px;
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        
                        <div class="content">
                            <p>Hello,</p>
                            <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
                            
                            <div style="text-align: center;">
                                <a href="${url}" class="reset-button">Reset My Password</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for your security.
                            </div>
                            
                            <p><strong>If the button doesn't work</strong>, copy and paste the following URL into your browser:</p>
                            
                            <div class="fallback-url">
                                <strong>Reset URL:</strong><br>
                                ${url}
                            </div>
                            
                            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                        </div>
                        
                        <div class="footer">
                            <p>This email was sent from John Doe Blog Platform</p>
                            <p>For security reasons, this link will expire in 1 hour.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        })

    } catch (err) {
        console.error("Error sending email:", err);
        throw new ApiError(500,"Failed to send password reset email");
    }

}