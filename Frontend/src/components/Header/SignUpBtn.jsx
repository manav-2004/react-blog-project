import React from 'react'
import { useNavigate } from 'react-router'

function SignUpBtn(
  {
    extraCss = "border-[3px] border-transparent hover:border-cyan-300 px-3 py-[4px] bg-cyan-500 text-white"
  }
) {

    const navigate = useNavigate()

  return (
    <div className='buttons-div w-[96px]'>
        <button className={`buttons ${extraCss}`} onClick={()=>navigate("/signUp")}>Sign Up</button>
    </div>
  )
}

export default SignUpBtn