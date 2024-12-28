import React from 'react'
import { Authorize } from './services/auth.services'
import { useState } from 'react'

function Login() {

    const [data, setData] = useState({
        email : "",
        password : ""
    })

    const handleChange = (e)=>{
        const {name, value} = e.target
        setData({
          ...data,
          [name] : value
        })
    }
    
    const handlesubmit = ()=>{
      Authorize.login(data)
      .then((data)=>{
          console.log(data)
      })
      .catch((err)=>{
          console.log(err)
      })
    }

    const handleUser = async ()=>{
      try {
        const res = await Authorize.getUser()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }

    const handleLogout = async ()=>{
      try {
        const res = await Authorize.logout()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }


  return (
    <div className="h-screen w-full flex items-center justify-center gap-2 bg-black flex-col border-t-2 border-yellow-500">
      <input type="email" name="email" placeholder="email" value={data.email} onChange={handleChange}/>
      <input type="password" name="password" placeholder="password" value={data.password} onChange={handleChange}/>
      <button onClick={handlesubmit} className="bg-cyan-700 text-white">submit</button>
      <button onClick={handleUser} className="border-2 border-white rounded-md px-2 py-1 font-mono text-white font-bold bg-cyan-600">GetUser</button>
      <button onClick={handleLogout} className="border-2 border-white rounded-md px-2 py-1 font-mono text-white font-bold bg-green-400">logout</button>
    </div>
  )
}

export default Login