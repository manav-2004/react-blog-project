import React, { useEffect, useState } from 'react'
import { Container } from '../components'
import { useNavigate, useParams } from 'react-router'
import { use } from 'react'
import { Authorize } from '../services/auth.services'

function UserProfile() {

    const [data, setData] = useState({
        fullname : "",
        email : "",
        username : "",
        blogsCount : 0,
    })

    const [blogs, setBlogs] = useState([])
    const [status , setStatus] = useState(false)
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")

    const {id} = useParams()
    const navigate = useNavigate()

    setInterval(()=>{

        Authorize.fetchStatus({id})
        .then((res)=>{
            setStatus(res.data.status)
        })
        .catch((err)=>{
            console.error(err)
        })

    },5000)


    useEffect(()=>{

        Authorize.getUserData({id})
        .then((res)=>{
            setBlogs(res.data.blogs)

            const {fullname = "", email = "", username = "",status : _status = false, avatar = null} = res.data
            setData({
                fullname,
                email,
                username,
                blogsCount : res.data.blogs?.length || 0
            })
            setStatus(_status)

            if (avatar){
                setImage(avatar)
            }
        })
        .catch((err)=>{
            console.error(err)
        })
    },[])

  return (
    <div className='min-h-screen pt-12'>
        <Container>
            <div className='h-full w-full flex flex-col gap-6'>
                <h1 className='text-center w-full text-4xl text-cyan-900 '><span className='border-b-[2px] border-cyan-950'>User </span><span className='border-cyan-950 text-cyan-700 border-b-[2px]'>Profile</span></h1>
                <div className='w-full h-[60vh] flex flex-col items-center justify-center gap-10'>
                    <img className='h-40 aspect-square rounded-full' src={image} />
                    <div className={`${status ? 'text-green-500' :'text-red-700'}`}>{status ? 'Online' : 'Offline'}</div>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        {
                            Object.entries(data).map((item, key)=>(
                            <div className='flex items-center justify-between w-full gap-4' key={key}>
                                <h2 className='font-bold text-xl text-cyan-500 w-28'>{item[0]}</h2>
                                <h2 className='font-bold text-xl text-cyan-300'>:</h2>
                                <input type="text" className='text-xl border-[1px] border-slate-200 rounded-xl px-10 py-2 bg-white' disabled value={item[1]}/>
                            </div>
                            ))
                        }
                    </div>
                </div>
                { blogs.length > 0 &&
                    <div className='w-full min-h-[50vh]'>
                            <h1 className='text-2xl mb-10'>Blogs</h1>
                            <div className='w-full flex gap-10'>
                                {
                                    blogs.map((blog, key)=>(
                                        <div className='w-[14vw] rounded-xl flex flex-col overflow-hidden shadow-lg cursor-pointer' onClick={()=>{navigate(`/blog/${blog._id}`)}} key={key}>
                                            <img src={blog.featuredImage} className='w-full aspect-auto' />
                                            <h2 className='w-full flex items-center max-h-1/2 px-2 py-4'>{blog.title}</h2>
                                        </div>
                                    ))
                                }

                            </div>
                    </div>
                }
            </div>
        </Container>
    </div>
  )
}

export default UserProfile