import React, { useState } from 'react'
import {Input, Button} from "."
import { login as authLogin } from '../features/authSlice'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Authorize } from '../services/auth.services'
import {useForm} from "react-hook-form"
import logo from "/logo2.png"
import googleImg from "/google.png"
import {Loader} from "./index"
import {useGoogleLogin} from "@react-oauth/google"

function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [errors, setErrors] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async (data)=>{
        try {
 
            setErrors("")
            const res = await Authorize.login(data)
            console.log(res)

            dispatch(authLogin({data : res.data}))
            navigate("/")
        } catch (error) {
            setErrors(error.response.data.message)
        }

    }

    const fn = async (authRes) => {

        setErrors("")
        try {

            const code = authRes["code"]
            setLoading(prev => !prev)

            const res = await Authorize.googleLogin(code)
            console.log(res)

            dispatch(authLogin({data : res.data}))
            navigate("/")
            //api call
            
        } catch (error) {
            setErrors(error.response.data.message)
            setLoading(prev => !prev)
        }

    }

    const googleLogin = useGoogleLogin({
        onSuccess : fn,
        onError : fn,
        flow : "auth-code"
    })


    return loading ? 
    (   <div>
            <Loader/>
        </div>
    ) :(
        <div className='flex w-full justify-center items-center bg-white dark:bg-gray-900 dark:text-white'>
            <div className='mx-auto w-full max-w-lg bg-gray-100 dark:bg-gray-800 rounded-xl p-10 border border-black/10 dark:border-gray-700'>
                <div className='mb-2 flex justify-center'>
                        <img src={logo} alt="" className='h-32 aspect-auto' />
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60 dark:text-gray-400">
                            Don&apos;t have any account?&nbsp;
                            <Link
                                to="/signUp"
                                className="font-bold text-cyan-600 transition-all duration-200 hover:underline"
                            >
                                Sign Up
                            </Link>
                </p>
                {errors && <p className='text-red-600 mt-8 text-center dark:text-red-400'>{errors}</p>}
                <form onSubmit={handleSubmit(login)}>
                    <Input
                        type = "email"
                        label = "Email : "
                        placeholder = "Enter email here ..."
                        {...register("email",{
                            required : true,
                            validate : {
                                matchPattern : (value)=>/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Email Address must be valid"
                            }
                        })}
                    />
                    <Input
                        type = "password"
                        label = "Password : "
                        placeholder = "Enter password here ..."
                        {...register("password",{
                            required : true
                        })}
                    />
                    <Button className='w-full mt-8'>Sign In</Button>

                </form>

        
                    <div className='mt-6 font-normal text-sm underline text-cyan-700 w-full flex justify-end cursor-pointer' onClick={()=>{
                        navigate("/forgot-password")
                    }}>Forgot Password ?</div>

                    <div className='w-full mt-4 flex items-center'>
                        <div className='w-1/2 border-t-2'></div>
                        <div className='text-gray-400 mx-2'>or</div>
                        <div className='w-1/2 border-t-2'></div>
                    </div>

                    <div className='w-full mt-4'>
                        <button className='w-full rounded-lg outline-none border-2 border-cyan-600 font-normal py-2 flex justify-center gap-4' onClick={googleLogin}>
                             <img src={googleImg} alt="" className='w-6 aspect-auto'/> Log in with Google</button>
                    </div>
            </div>
        </div>
    )
}

export default Login