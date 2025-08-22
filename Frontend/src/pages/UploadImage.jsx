import React, { useEffect, useState } from 'react'
import {Loader,Button} from "../components"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import Blog from './Blog'
import { login as authLogin } from '../features/authSlice'
import user from '/public/user.png'

function UploadImage() {

  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const authStatus = useSelector(state=>state.auth.status)
  const [avatar, setAvatar] = useState(user)
  const [showNext, setShowNext] = useState(false)

  const setImage = async (e)=>{
    const file = e.target.files[0]
    const imageUrl = URL.createObjectURL(file)
    setAvatar(imageUrl)
    setShowNext(true)
  }

  const uploadWithoutImage = async(e)=>{
    console.log("i got clicked")
  }
  useEffect(()=>{
    if (!authStatus){
      navigate("/signUp")
    }
    setLoading(false)

  })


  return loading ? (
    <div>
      <Loader/>
    </div>
  ) : (
  <div className='w-full min-h-screen relative bg-white dark:bg-gray-900 dark:text-white'>
  <div className='w-full min-h-screen flex justify-center items-center flex-col gap-10 border border-black dark:border-gray-700 bg-white dark:bg-gray-900'>
        <div>
          <img src={avatar} alt="" className='w-48 h-48 rounded-full border dark:border-gray-700'/>
        </div>
        <div className='flex gap-6'>
          <label htmlFor="upload" className='cursor-pointer'>
            <input type="file" id='upload' className='sr-only' onChange={setImage}/>
            <h2 className='px-4 py-2 rounded-lg text-white bg-cyan-600 dark:bg-cyan-800'>Upload</h2>
          </label>
          <Button
            bgColor= {showNext ? 'bg-red-200' : 'bg-red-500'}
            onClick = {uploadWithoutImage}
            disabled = {showNext ? true : false}
          >
            skip
          </Button>
        </div>
      </div>
      {
        showNext && 
        <div className='absolute bottom-4 right-4 z-10'>
          <Button
            bgColor='bg-cyan-900'
          >
            register
          </Button>
        </div>
      }
    </div>
  )
}

export default UploadImage