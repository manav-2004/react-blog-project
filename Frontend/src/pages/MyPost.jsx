import React, { useEffect, useState } from 'react'
import { Container, Card, Loader } from '../components'
import { Blog } from '../services/blog.services'
import DialogBox from '../components/DialogBox'
import { Blog as BlogServices } from '../services/blog.services'
import {toast} from 'react-toastify'
import { set } from 'react-hook-form'

function MyPost() {

    const [allBlogs, setAllBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{

        window.scrollTo(0,0)

        Blog.getMyBlogs()
        .then((response)=>{
            setAllBlogs(response.data.blogs)
            setLoading(false)
        })
        .catch((error)=>{
            throw error
        })

    },[])
    
    const [dialogBox, activateDialogBox] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState(null)

    const deletePost = async(id)=>{
        activateDialogBox(false)
        if (!deletingPostId) return
        try {
            
            await BlogServices.deleteBlog(deletingPostId)
            toast.success("Blog Deleted Successfully!",{
                theme : "light",
                className : "custom-toast-success"
            })
            window.location.reload()

        } catch (error) {
            throw error
        }
    }

    const [scrollVal, setScrollVal] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
          setScrollVal(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);


  return loading ? (
    <div>
        <Loader/>
    </div>
  ):(
    <div className={`p-8 min-h-screen`}>
        <Container extraCss='relative'>
        {dialogBox && <DialogBox falseFn={()=>{activateDialogBox(false)}} trueFn={deletePost}/>}            
           {
            allBlogs.length === 0?
            (
                <div className='min-h-screen w-full flex justify-center items-center'>
                    <h2 className='text-5xl font-bold font-mono'>No Uploads Yet!</h2>
                </div>
            )
            :
            (<div className={`flex flex-wrap gap-10 max-md:justify-center ${dialogBox ? 'opacity-40':''}`}>
                {
                    allBlogs.map((blog)=>(
                        <Card
                            title={blog.title}
                            id = {blog._id}
                            image ={blog.featuredImage}
                            parsedContent={blog.content}
                            key={blog._id}
                            deletePost={(id)=>{
                                window.scrollTo(0,0)
                                activateDialogBox(true)
                                setDeletingPostId(id)
                            }}
                            category={blog.category}
                        />
                    ))
                }
            </div>)
            }
        </Container>
    </div>
  )
}

export default MyPost