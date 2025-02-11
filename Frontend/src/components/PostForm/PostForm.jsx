import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Blog } from '../../services/blog.services'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import {Button, Input, Select, RTE, Container} from '..'

//here post is data sent if user clicks on edit button
function PostForm({post}) {

    //since post is an object

    const {register, handleSubmit, setValue, watch, control, getValues} = useForm({
        defaultValues : {
            title : post?.title || "",
            slug : post?.slug || "",
            content : post?.content || "",
            status : post?.status ?? true
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.data)
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(post?.featuredImage || null)

    const dropDownOptions = [
        {
            name : "Active",
            value : true,
        },
        {
            name : "InActive",
            value : false,
        }
    ]
    const catOptions = [
        { name: "Tech", value: "Tech" },
        { name: "Lifestyle", value: "Lifestyle" },
        { name: "Business", value: "Business" },
        { name: "Education", value: "Education" },
        { name: "Entertainment", value: "Entertainment" },
        { name: "Health", value: "Health" },
        { name: "Others", value: "Others" }
    ];
    

    const submit = async (blogData)=>{
        if (post){
            //since post is here that means user wants to edit

            try {
                
                image? await Blog.editImage(post._id,image) : null

                await Blog.editBlog(post._id, blogData)
                
                navigate(`/blog/${post._id}`)

            } catch (error) {
                throw error
            }
        }
        else{
            //this is when i am newly creating a blog   
            try {
                

                const res = await Blog.addBlog(blogData,image)
                navigate(`/blog/${res.data._id}`)

            } catch (error) {
                throw error
            }
        }
    }

    const handleSlug = useCallback((value)=>{

        if (value && typeof value === 'string'){
            const slug = value.toLowerCase().replace(/ /g,"-")
            return slug
        }
        return ""
    }, [])

    useEffect(()=>{
        console.log("hello baby" + Math.random())
        const subscription = watch((value, {name})=>{
            if (name === 'title'){
                setValue('slug',handleSlug(value.title),{
                    shouldValidate : true
                })
            }
        })

        return ()=>{
            subscription.unsubscribe()
        }
    },[watch, handleSlug, setValue])

    const handleImage = (e)=>{
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    }


  return (
    <Container>
        <form onSubmit={handleSubmit(submit)} className='flex flex-wrap py-2 mt-12 max-md:flex-col'>
            <div className='w-2/3 border-r-[2px] px-6 max-md:w-full'>
                <Input
                    type = "text"
                    label = "title :"
                    placeholder = "Enter title here..."
                    className = "border-2 border-cyan-500"
                    {...register("title",{
                        required : true
                    })}
                />
                <Input
                    type = "text"
                    label = "slug :"
                    placeholder = "Enter slug here..."
                    className = "border-2 border-cyan-500"
                    onInput = {(e)=>{
                        setValue('slug',handleSlug(e.target.value))
                        setValue('title',e.target.value.split("-").join(" "))
                    }}
                    {...register("slug",{
                        required : true
                    })}
                    
                />
                <RTE
                    control={control}
                    label = "Editor :"
                    name = "content"
                    defaultValue={getValues('content')}
                />
            </div>
            <div className='w-1/3 px-4 max-md:w-full'>
                <Input
                    type = "file"
                    label = "Featured Image :"
                    accept = "image/jpg, image/png, image/jpeg, image/gif"
                    fn={handleImage}
                    required = {!post}
                />
                {
                    imageUrl ? (<img src={imageUrl} className='rounded-lg mt-6 w-full aspect-auto'/>) : null
                }
                <Select
                    options = {catOptions}
                    {...register("category")}
                />   
                <Select
                    options = {dropDownOptions}
                    {...register("status")}
                />   
                <Button
                    type='submit'
                    className='w-full mt-10'
                >
                    {post ? 'Update' : 'Upload'}
                </Button>             
            </div>
        </form>
    </Container>
  )
}

export default PostForm