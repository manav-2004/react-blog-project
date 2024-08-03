import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { Blog as BlogServices} from '../services/blog.services'
import { Container, Button , Loader} from '../components'
import parse from 'html-react-parser'
import {toast} from 'react-toastify'


function Blog() {

    const [post , setPost] = useState(null)
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.data)
    const {id} = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{

        if (id){

            BlogServices.getBlog(id)
            .then((response)=>{
                setPost(response.data)
                setLoading(false)
            })
            .catch((error)=>{
                navigate("/")
                throw error
            })

        }else{
            navigate("/")
        }

    },[id])

    const isAuthor = userData && post ? userData._id === post.owner : false
    
    const deletePost = async()=>{
        try {
            
            await BlogServices.deleteBlog(id)
            toast.success("Blog Deleted Successfully!",{
                theme : "light",
                className : "custom-toast-success"
            })
            navigate("/")

        } catch (error) {
            throw error
        }
    }


  return loading ? (
    <div>
        <Loader/>
    </div>
  ) : (
    <div className='min-h-screen my-20'>
        <Container>
            <div className='flex w-full flex-col gap-6'>
                <div className='w-full p-10 border border-gray-600 rounded-2xl relative'>
                    <img src={post?.featuredImage} alt="" className='h-full w-full'/>
                    {
                        isAuthor && 
                        (
                            <div className='flex gap-4 absolute z-10 top-16 right-16'>
                                <Button bgColor='bg-green-600' onClick = {()=>{navigate(`/edit-blog/${id}`)}}>
                                    Edit
                                </Button>
                                <Button bgColor='bg-red-600' onClick = {deletePost}>
                                    Remove
                                </Button>
                            </div>
                        )                 
                    }
                </div>
                <h2 className='mt-4 text-2xl underline'>{post?.title}</h2>
                <p>
                    {post?.content ? parse(post?.content) : "No Content Available"}
                    {/* DomPurify to prevent XSS */}
                </p>
            </div>
        </Container>
    </div>
  )
}

export default Blog