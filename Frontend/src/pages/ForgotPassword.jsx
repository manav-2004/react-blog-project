import React from 'react'
import logo from '/logo2.png'
import { Authorize } from '../services/auth.services'
import {useNavigate} from "react-router-dom"
import { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import '../css/toast.css'

function ForgotPassword() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")


    const send = async ()=>{

        if (!email) return

        try {
            
            const res = await Authorize.sendMail({email})
            toast.success("Mail Sent Successfully",{
                theme : "light",
                className : "custom-toast-success"
            })

        } catch (err) {
            toast.error(err.response.data.message,{
                theme : "light",
                className : "custom-toast-error"
            })
            throw err
            
        }
    }

  return (
    <div className='h-screen w-full flex flex-col bg-white dark:bg-gray-900 dark:text-white'>
    <div className='w-full h-1/6 flex justify-center items-center'>
            <img src = {logo} className='w-44 aspect-auto'/>
        </div>
    <div className='w-full h-5/6 flex item-center justify-center'>
            <div className='flex flex-col justify-center items-center h-[500px] px-6 gap-6 dark:bg-gray-900 dark:text-white'>
                <h1 className='text-2xl text-cyan-700 dark:text-cyan-400 mb-8'>Password Reset Mail</h1>
                <input type="text" placeholder='Enter Your mail here' className='border-[2px] rounded-lg border-cyan-500 dark:border-cyan-400 w-[350px] px-4 py-2 outline-none dark:bg-gray-800 dark:text-white' value={email} 
                onChange={(e)=>{
                    setEmail(e.target.value)
                }}/>
                <div className='w-full flex justify-end'>
                    <button className='px-4 py-2 bg-cyan-400 dark:bg-cyan-800 text-white font-mono rounded-lg' onClick={send}>Send Mail</button>
                </div>
                <h1 className='flex justify-start w-full font-normal underline font-mono text-cyan-400 dark:text-cyan-300 cursor-pointer' onClick={()=>{
                    navigate("/login")
                }}>Go Back To Login</h1>
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword