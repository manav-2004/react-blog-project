import React, { useEffect, useState } from 'react'
import { PostForm } from '../components'
import { Blog } from '../services/blog.services'
import { useNavigate, useParams } from 'react-router'

function EditPost() {

  const [post, setPost] = useState(null)
  const navigate = useNavigate()
  const {id} = useParams()

  useEffect(()=>{

    if (id){
        Blog.getBlog(id)
        .then((response)=>{
          setPost(response.data)
        })
        .catch((error)=>{
          navigate("/")
          throw error
        })
    }
    else{
        navigate("/")
    }

  },[id, navigate])


  return post ? (
    <div className='mb-12 min-h-screen'>
        <PostForm post={post}/>
        {/* or <PostForm {...post}/> */}
    </div>
  ) : null
}

export default EditPost