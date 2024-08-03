import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import {Container, Input, Button} from '../components'
import { useNavigate } from 'react-router'
import { Authorize } from '../services/auth.services'
import {toast} from 'react-toastify'

function ChangePassword() {

    const navigate = useNavigate()
    const {register, handleSubmit,setFocus} = useForm()
    const [oldPassVisible, setOldPassVisible] = useState(false)
    const [newPassVisible, setNewPassVisible] = useState(false)
    const [errors, setErrors] = useState(null)

    const changePass = async (data)=>{
        try {
            setErrors(null)
            await Authorize.changePassword(data)
            toast.success("Password Updated Successfully",{
                theme : "light",
                className : "custom-toast-success"
            })
            navigate("/")
        } catch (error) {
            setErrors(error.message)
        }
    }

  return (
    <Container>
        <div className='min-h-screen w-full relative mt-16'>
            <h2 className='mx-auto w-full justify-center items-center flex text-red-600'>{errors}</h2>
            <form className='w-2/3 mx-auto' onSubmit={handleSubmit(changePass)}>
                <div className='flex justify-center items-center w-full gap-1'>
                    <Input
                        type = {oldPassVisible ? 'text' : 'password'}
                        label = "Old Password :"
                        labelClass = "w-1/3 text-cyan-700"
                        topDivClass = "flex items-center justify-center w-2/3"
                        {...register("oldPassword",{
                        required : true
                        })}
                    />
                    <button className='mt-8' onClick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        setOldPassVisible(prev=>!prev)
                        
                        }}>
                        {
                            oldPassVisible ? <i className="ri-eye-line text-xl"/> : <i className="ri-eye-off-line text-xl"/>
                        }
                    </button>
                </div>
                <div className='flex justify-center items-center w-full gap-1'>
                    <Input
                        type = {newPassVisible ? 'text' : 'password'}
                        label = "New Password :"
                        labelClass = "w-1/3 text-cyan-700"
                        topDivClass = "flex items-center justify-center w-2/3"
                        {...register("newPassword",{
                        required : true
                        })}
                    />
                        <button className='mt-8' onClick={(e)=>{
                            e.preventDefault()
                            e.stopPropagation()
                            setNewPassVisible(prev=>!prev)
                            }}>
                        {
                            newPassVisible ? <i className="ri-eye-line text-xl"/> : <i className="ri-eye-off-line text-xl"/>
                        }
                    </button>
                </div>
                <div className='flex justify-center items-center'>
                    <Button
                    type='submit'
                    bgColor='bg-orange-500'
                    className='w-1/6 mt-10'
                    >
                        Update
                    </Button>
                </div>
            </form>
        </div>
    </Container>
  )
}

export default ChangePassword