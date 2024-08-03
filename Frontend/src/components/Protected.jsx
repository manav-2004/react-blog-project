import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import Loader from './Loader'

function Protected({children, authentication}) {


    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const navigate = useNavigate()
    const location = useLocation()
    
    useEffect(()=>{
        
        if (authentication && (authStatus !== authentication)){
            navigate("/")
            // navigate("/login")
        }
        else if(!authentication && (authStatus !== authentication)){
            navigate("/")
        }
        setLoader(false)    

    },[authStatus, authentication, navigate])

  return loader ? (
    <Loader/>
  ):(
    <div>
      {children}
    </div>
  )
}

export default Protected