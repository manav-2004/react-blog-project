import React, { useEffect, useState } from 'react'
import { Container } from '../components'
import user from '/public/user.png'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {Input, Button, Loader} from '../components'
import { Authorize } from '../services/auth.services'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import '../css/toast.css'
import { login } from '../features/authSlice'
import { useNavigate } from 'react-router'

function Profile() {

  const [loading, setLoading] = useState(true)
  const [profImage, setProfImage] = useState(user)
  const userData = useSelector(state => state.auth.data)
  const [profileEditing, setProfileEditing] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {handleSubmit, register, setFocus} = useForm({
    defaultValues : {
      fullname : userData?.fullname || "",
      username : userData?.username || "",
      email : userData?.email || ""
    }
  })

  useEffect(()=>{
    if (userData?.avatar){
      setProfImage(userData?.avatar)
    }
    setLoading(false)
  },[])

  const editProfile = async (data)=>{
    try {
        
      await Authorize.updateDetails(data)
      toast.success("Profile Updated Successfully",{
        theme : "light",
        className : "custom-toast-success"
      })
      setProfileEditing(false)
            
    } catch (error) {
        toast.error(error.message,{
          theme : "light",
          className : "custom-toast-error"
        })
      throw error
    }
  }

  const toggleEditing = ()=>{
    setProfileEditing(true)
    setFocus('fullname')
  }

  const editAvatar = async (e)=>{
    if (!e.target.files[0]){
      toast.error("Please provide an image",{
        theme : "light",
        className : "custom-toast-error"
      })
      return
    }

    try {

      const user = await Authorize.updateAvatar(e.target.files[0])

      setProfImage(user?.data?.avatar)
      dispatch(login({data : user.data}))
      toast.success("Avatar Updated Successfully",{
        theme : "light",
        className : "custom-toast-success"
      })
      
    } catch (error) {
      toast.error(error.message,{
        theme : "light",
        className : "custom-toast-error"
      })
      throw error
    }

  }


  return loading ? (
    <div>
      <Loader/>
    </div>
  ): (
    <div className='min-h-screen' >
      <Container>
        <div className='flex items-center justify-center min-h-screen flex-col'>
          <div className='py-8 border-b-[1px] border-gray-400 relative'>
            <img src={profImage} alt="" className='h-44 aspect-square rounded-full hover:w-52 hover:h-52'/>
            <label htmlFor="edit" className={`absolute z-10 top-40 right-0 cursor-pointer`}>
              <input type="file" className='sr-only' onChange={editAvatar} id='edit'/>
              <h2 className='bg-cyan-600 text-white px-2 rounded-lg text-sm'>Edit</h2>
            </label>
          </div>
          <div className='w-full flex justify-center items-center flex-col'>
            <form onSubmit={handleSubmit(editProfile)} className='w-1/2 flex justify-center flex-col items-center'>
                <Input
                  label = "Fullname :"
                  labelClass = "w-1/3 text-cyan-700"
                  topDivClass = "flex items-center justify-center w-full px-16"
                  readOnly = {!profileEditing}
                  {...register("fullname",{
                    required : true
                  })}
                />
                <Input
                  label = "Username :"
                  labelClass = "w-1/3 text-cyan-700"
                  topDivClass = "flex items-center justify-center px-16 w-full"
                  readOnly = {!profileEditing}
                  {...register("username",{
                    required : true
                  })}
                />
                <Input
                  label = "Email :"
                  labelClass = "w-1/3 text-cyan-700"
                  topDivClass = "flex items-center justify-center px-16 w-full"
                  readOnly = {!profileEditing}
                  {...register("email",{
                    required : true,
                    validate : {
                      matchPattern : (value)=>/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Email Address must be valid"
                    }
                  })}
                />
                {                 
                
                profileEditing &&
                  <Button
                    bgColor='bg-orange-500'
                    type='submit'
                    className='m-8'
                  >
                    Update
                  </Button>
                
                }
            </form>
            <div className='flex gap-2 w-full justify-end py-8 px-8'>
                  <Button
                    onClick = {toggleEditing}
                    className={profileEditing ? 'text-sm bg-green-200' : 'bg-green-400 text-sm'}
                    disabled = {profileEditing}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick = {()=>{navigate("/change-password")}}
                    className={profileEditing ? 'text-sm bg-yellow-200': 'bg-yellow-500 text-sm'}
                    disabled = {profileEditing}
                  >
                    changePassword
                  </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Profile