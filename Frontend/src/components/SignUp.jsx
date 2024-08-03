import React, { useState } from 'react'
import {Input, Button} from "."
import { login as authLogin } from '../features/authSlice'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Authorize } from '../services/auth.services'
import {useForm} from "react-hook-form"
import logo from "/logo.png"

function SignUp() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [errors, setErrors] = useState("")

    const signUp = async (data)=>{
        try {
            
            setErrors("")
            const res = await Authorize.register(data)
            dispatch(authLogin({data : res.data}))
            navigate("/")
        
        } catch (error) {
            setErrors(error.message)
        }
    }


    return (
        <div className='flex w-full justify-center items-center'>
            <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl px-10 py-4
            border border-black/10'>
                <div className='mb-2 flex justify-center'>
                        <img src={logo} alt="" className='h-32 aspect-auto' />
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign Up your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                            Already a User?
                            <Link
                                to="/login"
                                className="transition-all duration-200 hover:underline font-bold text-cyan-600"
                            >
                            <span className='opacity-0'>.</span>Log In
                            </Link>
                </p>
                {errors && <p className='text-red-600 mt-8 text-center'>{errors}</p>}
                <form onSubmit={handleSubmit(signUp)}>
                    <Input
                        type = "text"
                        label = "Fullname : "
                        placeholder = "Enter fullname here ..."
                        {...register("fullname",{
                            required : true
                        })}
                    />
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
                        type = "text"
                        placeholder = "Enter username here ..."
                        label = "Username : "
                        {...register("username",{
                            required : true
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
                    <Button className='w-full mt-8'>Sign Up</Button>

                </form>
            </div>
        </div>
    )
}

export default SignUp