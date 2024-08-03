import React, { useEffect, useState } from 'react'
import {LogoutBtn, Container, LoginBtn, SignUpBtn} from ".."
import {useNavigate, Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import logo from '/logo.png'
import user from '/public/user.png'
import { useLocation } from 'react-router-dom'

function Header() {

  const authStatus = useSelector(state => state.auth.status)
  // const authStatus = true
  const userData = useSelector(state=>state.auth.data)

  const [isBarOpen , setisBarOpen] = useState(false)

  const [profImage, setProfImage] = useState(user)

  const navigate = useNavigate()

  const location = useLocation()

  const routes = [
    {
      name : "Home",
      slug : "/",
      status : true
    },
    {
      name : "All Blogs",
      slug : "/all-blogs",
      status : authStatus
    },
    {
      name : "My Blogs",
      slug : "/my-blogs",
      status : authStatus
    },
    {
      name : "Add Blog",
      slug : "/add-blog",
      status : authStatus
    },
    {
      name : "Contact",
      slug : "/contact",
      status : true
    }
    
  ]

  useEffect(()=>{

    if (userData?.avatar){
      setProfImage(userData?.avatar)
    }

  })

  return (
    <header className='relative'>
      <Container>
          <div className='w-full h-28 flex items-center justify-between border-b-[3px] pr-8'>
            <Link to="/" className='cursor-pointer'>
              <img src={logo} alt="logo" className='h-32 aspect-auto'/>
            </Link>
            <ul className='flex gap-12 font-mono font-bold'>
              {
                routes.map((field)=>
                
                  field.status ? (
                    <li key={field.name} className={`cursor-pointer hover:underline ${location.pathname === field.slug ? 'text-cyan-700':''}`}
                       onClick={()=>{
                        setisBarOpen(false)
                        navigate(field.slug)
                      }}>
                      {field.name}
                    </li>
                  ) : null
                
                )
              }
            </ul>
            <div className=' flex'>
              {
                !authStatus && (
                  <>
                    <LoginBtn/>
                    <SignUpBtn/>
                  </>
                )
              }
              {
                authStatus && (
                  <button className='text-2xl' onClick = {()=>{setisBarOpen(prev => !prev)}}>{
                    isBarOpen ? <i className="ri-close-large-line"></i> : <i className="ri-bar-chart-horizontal-line"></i>
                  }</button>
                )
              }
            </div>
          </div>
      </Container>
      {
        isBarOpen && 

        <div className='h-64 w-64 px-6 absolute z-10 top-20 right-16 rounded-xl shadow-lg bg-white 
                        flex flex-col justify-around items-center'>
          <div className='h-36 w-full border-b-[1px] border-gray-300 flex justify-center items-center'><img src={profImage} alt="" className='h-24 w-24 rounded-full'/></div>
          <div className='flex flex-col items-center gap-4'>
            <button onClick={()=>{
              setisBarOpen(prev => !prev)
              navigate("/profile")
            }}>Profile</button>
            <button onClick={()=>setisBarOpen(prev => !prev)}>
              <LogoutBtn/>
            </button>
          </div>
        </div>
      }
    </header>
  )
}

export default Header