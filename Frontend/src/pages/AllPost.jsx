import React, { useEffect, useState } from 'react'
import { Container, Card, Loader } from '../components'
import { Blog } from '../services/blog.services'
import user from "/user.jpg"
import parse from 'html-react-parser'


function AllPost() {

    const [allBlogs, setAllBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{

        window.scrollTo(0,0)

        Blog.getAllBlogs()
        .then((response)=>{
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
            (<div className='flex flex-wrap gap-10 max-md:justify-center'>
                {
                    allBlogs.map((blog)=>(
                        <Card
                            title={blog.title}
                            id = {blog._id}
                            image ={blog.featuredImage}
                            ownerImage={blog.owner.avatar || user}
                            parsedContent={blog.content}
                            fullname={blog.owner.fullname.split(" ")[0]}
                            key={blog._id}
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
