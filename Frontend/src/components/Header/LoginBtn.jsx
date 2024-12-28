import React from 'react'
import { useNavigate } from 'react-router'

function LoginBtn({
  extraCss = "border-[3px] border-transparent hover:border-cyan-300 px-3 py-[4px] bg-cyan-500 text-white"
}) {

    const navigate = useNavigate()
  return (
    <div className={`buttons-div w-[88px]`}>
        <button className={`buttons ${extraCss}`} onClick={()=>navigate("/login")}>Log In</button>
    </div>
  )
}

export default LoginBtn