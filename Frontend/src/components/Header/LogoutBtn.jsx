import React from 'react'
import {Authorize} from '../../services/auth.services'
import {useDispatch} from 'react-redux'
import {logout} from '../../features/authSlice'
import { useNavigate } from 'react-router'

function LogoutBtn(
    {
        extraCss = "border-[3px] border-transparent hover:border-cyan-300 px-3 py-[4px] bg-cyan-500 text-white"
    }
) {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logoutHandler = async ()=>{
        try {
            
            const res = await Authorize.logout()
            dispatch(logout())
            console.log(res) 
            navigate("/")

        } catch (error) {
            throw error
        }
    }


  return (
    <div className='buttons-div w-[88px]'>
        <button
            className={`buttons ${extraCss}`}
            onClick={logoutHandler}
        >Logout</button>
    </div>
  )
}

export default LogoutBtn