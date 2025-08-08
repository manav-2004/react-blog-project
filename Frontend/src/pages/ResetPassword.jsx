import React from 'react'
import { useParams } from 'react-router'
import { Loader } from '../components'
import { useState } from 'react'
import { useEffect } from 'react'
import { Authorize } from '../services/auth.services'
import logo from '/logo2.png'


function ResetPassword() {

  const {token} = useParams()

  const [loading, setLoading] = useState(true)
  const [validToken, setValidToken] = useState(true)
  const [Password, setPassword] = useState("")
  const [Password2, setPassword2] = useState("")
  const [toggle1, setToggle1] = useState(false)
  const [toggle2, setToggle2] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState("")


  useEffect(()=>{

    Authorize.verifyToken({token})
    .then((res)=>{
      setValidToken(true)
    })
    .catch((err)=>{
      setValidToken(false)
    })
    .finally(()=>{
      setLoading(false)
    })

  },[])


  const send = async ()=>{

    setErrors("")

    if (!Password || !Password2) return

    if (Password != Password2){
      setErrors("Passwords Don't match")
      return
    }


    try {
      
      await Authorize.resetPassword({token, password : Password})
      setSuccess(true)

    } catch (err) {
      setErrors(err?.response?.data?.message)  
    }

  }

  return (
    loading ? (
      <Loader/>
    ) : (
      <div className='w-full h-screen'>
        {
          validToken ? (
              <div className='w-full h-screen'>
                {
                  success ? (
                    <div className='w-full h-screen flex justify-center items-center text-6xl text-cyan-500'>
                      Password Changed Successfully !
                    </div>
                  ) : (
                    <div className='h-screen w-full flex flex-col'>
                        <div className='w-full h-1/6 flex justify-center items-center'>
                            <img src = {logo} className='w-44 aspect-auto'/>
                        </div>
                        <div className='w-full h-5/6 flex item-center justify-center'>
                            <div className='flex flex-col justify-center items-center h-[500px] px-6 gap-6'>
                                <h1 className='text-2xl text-cyan-700 mb-8'>Reset Password </h1>
                                {
                                  errors.length > 0  && <h1 className='text-red-500'>{errors}</h1>
                                }
                                <div className='flex gap-2 items-center'>
                                    <input type={`${toggle1 ? "text" : "password"}`} placeholder='Enter Your Password' className='border-[2px] rounded-lg border-cyan-500 w-[350px] px-4 py-2 outline-none' value={Password} 
                                    onChange={(e)=>{
                                        setPassword(e.target.value)
                                    }}/>
                                    <div>
                                      <i className={`${toggle1 ? "ri-eye-line" : "ri-eye-off-line"}`} onClick={()=>{
                                        setToggle1(prev => !prev)
                                      }}></i>
                                    </div>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <input type={`${toggle2 ? "text" : "password"}`} placeholder='Enter Your Password Again' className='border-[2px] rounded-lg border-cyan-500 w-[350px] px-4 py-2 outline-none' value={Password2} 
                                    onChange={(e)=>{
                                        setPassword2(e.target.value)
                                    }}/>
                                    <div>
                                      <i className={`${toggle2 ? "ri-eye-line" : "ri-eye-off-line"}`} onClick={()=>{
                                        setToggle2(prev => !prev)
                                      }}></i>
                                    </div>
                                </div>
                                <div className='w-full flex justify-end'>
                                    <button className='px-4 py-2 bg-cyan-400 text-white font-mono rounded-lg mr-6' onClick={send}>Reset Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                  )
                }
              </div>
          ) : (
            <div className='w-full h-screen flex justify-center items-center flex-col gap-6'>
              <h1 className='text-8xl'>404</h1>
              <h1 className='text-3xl font-semibold'>Oops... Page Not Found</h1>
            </div>
          )
        }
      </div>
    )
  )
}

export default ResetPassword