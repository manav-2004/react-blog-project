import React, { useEffect, useState } from 'react'
import { Container, Card, Loader } from '../components'
import { Blog } from '../services/blog.services'

function AllPost() {

    const [allBlogs, setAllBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{


        Blog.getAllBlogs()
        .then((response)=>{
            console.log(response.data.data)
            setAllBlogs(response.data.data)
            setLoading(false)
        })
        .catch((error)=>{
            throw error
        })

    },[])


return loading ? (
    <div>
        <Loader/>
    </div>
    ):(
    <div className='p-8 min-h-screen'>
        <Container>
            {
            allBlogs.length === 0?
            (
                <div className='min-h-screen w-full flex justify-center items-center'>
                    <h2 className='text-5xl font-bold font-mono'>No Uploads Yet!</h2>
                </div>
            )
            :
            (<div className='flex flex-wrap gap-10'>
                {
                    allBlogs.map((blog)=>(
                        <Card
                            title={blog.title}
                            id = {blog._id}
                            image ={blog.featuredImage}
                            ownerImage={blog.owner.avatar}
                        />
                    ))
                }
            </div>)
            }
        </Container>
    </div>
    )
}

export default AllPost
