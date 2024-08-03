import React from 'react'
import { useNavigate } from 'react-router'

function SignUpBtn() {

    const navigate = useNavigate()

  return (
    <div className='buttons-div w-[96px]'>
        <button className='buttons' onClick={()=>navigate("/signUp")}>Sign Up</button>
    </div>
  )
}

export default SignUpBtn