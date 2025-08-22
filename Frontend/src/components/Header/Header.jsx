import React, { useEffect, useState } from 'react'
import {LogoutBtn, Container, LoginBtn, SignUpBtn} from ".."
import {useNavigate, Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import logo from '/logo2.png'
import user from '/public/user.png'
import { useLocation } from 'react-router-dom'
import DarkModeToggle from '../DarkModeToggle'

function Header() {

  const authStatus = useSelector(state => state.auth.status)
  // const authStatus = true

  const [isBarOpen , setisBarOpen] = useState(false)

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
      status : true
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
      name : "Profile",
      slug : "/profile",
      status : authStatus
    }
    
  ]

  return (
  <div className='relative dark:bg-gray-900 dark:text-white'>
      <Container>
          <div className='w-full h-28 flex items-center justify-between border-b-[3px] pr-8 dark:border-gray-700'>
            <Link to="/" className='cursor-pointer'>
              <img src={logo} alt="logo" className='h-32 aspect-auto'/>
            </Link>
            <ul className='flex gap-8 max-lg:text-[13px] lg:gap-12 font-mono max-sm:hidden mr-4'>
              {
                routes.map((field)=>
                
                  field.status ? (
                    <li key={field.name} className={`cursor-pointer hover:underline ${location.pathname === field.slug ? 'text-cyan-700 dark:text-cyan-400':''}`}
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
            <div className=' flex items-center'>
              <DarkModeToggle/>
              {
                !authStatus && (
                  <div className='max-sm:hidden w-full flex'>
                    <LoginBtn/>
                    <SignUpBtn/>
                  </div>
                )
              }
              {
                authStatus && (
                  <>
                    <div className='max-sm:hidden'><LogoutBtn/></div>
                  </>
                )
              }
              <button className='text-2xl sm:hidden dark:text-white' onClick = {()=>{setisBarOpen(prev => !prev)}}>
                <i className="ri-bar-chart-horizontal-line"></i>
              </button>
            </div>
          </div>
      </Container>
      {
        isBarOpen && 

        <div className='sm:hidden min-h-[50vh] w-[320px] px-6 absolute z-50 top-0 right-0 rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 flex flex-col justify-around items-center'>
          <div className='w-full flex justify-end'>
            <i className="ri-close-large-line cursor-pointer text-xl -mb-4" onClick = {()=>{setisBarOpen(prev => !prev)}}></i> 
          </div>
         {
          authStatus &&
            <div className='h-36 w-full border-b-[1px] border-gray-300 dark:border-gray-700 flex justify-center items-center mb-4'><img src={profImage} alt="" className='h-24 w-24 rounded-full'/></div> 
          }
            <div className='flex flex-col items-center gap-4'>
            <ul className='flex flex-col gap-6 font-mono'>
                {
                  routes.map((field)=>
                  
                    field.status ? (
                      <li key={field.name} className={`cursor-pointer hover:underline ${location.pathname === field.slug ? 'text-cyan-700 dark:text-cyan-400':''}`}
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
              <button onClick={()=>setisBarOpen(prev => !prev)} className='mb-2 mt-3'>
                {
                  authStatus ? (
                    <LogoutBtn/>
                  ):(
                  <>
                    <LoginBtn/>
                    <SignUpBtn/>
                  </>)
                }
              </button>
          </div>
        </div>
      }
    </div>
  )
}

export default Header