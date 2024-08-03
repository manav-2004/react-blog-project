import React from 'react'
import { useNavigate } from 'react-router'

function LoginBtn() {

    const navigate = useNavigate()
  return (
    <div className='buttons-div w-[88px]'>
        <button className='buttons' onClick={()=>navigate("/login")}>Log In</button>
    </div>
  )
}

export default LoginBtn