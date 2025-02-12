import React, { useEffect, useRef, useState } from 'react'
import { Container, Card, Loader } from '../components'
import { Blog } from '../services/blog.services'
import user from "/user.jpg"
import parse from 'html-react-parser'

function AllPost() {

    const [allBlogs, setAllBlogs] = useState([])
    const [globalBlogs, setGlobalBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [blur, setBlur] = useState(false);
    const [category, setCategory] = useState("All");
    const val = useRef(null);
    const inputBox = useRef(null);
    const [showSearch, setShowSearch] = useState(false)

    useEffect(()=>{

        window.scrollTo(0,0)

        Blog.getAllBlogs()
        .then((response)=>{
            // setAllBlogs(response.data.data)
            const copyArr = response.data.data
            for (let i = 0; i<copyArr.length; i++){
                const j = Math.floor(Math.random()*(i+1));
                [copyArr[i],copyArr[j]] = [copyArr[j], copyArr[i]];
            }
            setAllBlogs(copyArr);
            setGlobalBlogs(copyArr);
            setLoading(false)
        })
        .catch((error)=>{
            throw error
        })

    },[])

    useEffect(()=>{

        if (category == "All"){
            setAllBlogs(globalBlogs)
            return
        }

        const newArray = globalBlogs.filter((blog)=>blog.category == category)
        setAllBlogs(newArray)

    },[category])

    useEffect(()=>{

        const fn = ()=>{
            setBlur(false);
        }

        document.addEventListener("visibilitychange",fn);
        return ()=>{
            document.removeEventListener("visibilitychange",fn);
        }
    },[])

    const inputBoxFn = (e)=>{
        const val = e.target.value.toLowerCase()

        const arr = globalBlogs.filter((blog)=>blog.title.toLowerCase().includes(val));
        setAllBlogs(arr);
    }


return loading ? (
    <div>
        <Loader/>
    </div>
    ):(
    <div className='p-8 min-h-screen'>
        {/* <Container extraCss='z-50 absolute h-screen'></Container> */}
        <Container extraCss=''>
            <div className=''>
            {
            globalBlogs.length === 0?
            (
                <div className='min-h-screen w-full flex justify-center items-center'>
                    <h2 className='text-5xl font-bold font-mono'>No Uploads Yet!</h2>
                </div>
            )
            :
            (
                <div className='w-full flex flex-col gap-4 font-mono'> 
                    <div className={`w-full flex items-center justify-end cursor-pointer max-md:justify-center px-20 mb-2 max-md:flex-col max-md:px-0 max-md:gap-8`}>
                        <div className={`w-5/6 flex justify-center items-center gap-4 ${showSearch ? '':'hidden'} max-md:order-2 max-md:flex-col`}>
                            <input type="text" className={`px-4  w-1/3 border-b-2 border-cyan-600 outline-none`} ref={inputBox} onChange={inputBoxFn}placeholder='Search a blog'/>
                            <button className='px-4 bg-cyan-600 text-white rounded-lg' onClick={()=>{setShowSearch(false)}}>Go</button>
                        </div>  

                        <div className='flex items-center gap-8 md:w-1/6'>
                            <select className='border-none outline-none cursor-pointer px-4' value={category} ref={val} onClick={()=>{
                                setBlur(prev => !prev) 
                                setShowSearch(false)
                                inputBox.current.value = ""
                            }} onChange={(e)=>{setCategory(e.target.value)}}>
                                {
                                    ["All","Tech","Lifestyle","Business","Education","Entertainment","Health","Others"].map((category)=>(
                                        <option value={category} className={`${ val.current?.value === category ? 'bg-cyan-500 text-white' : ''} outline-none border-none`}>{category}</option>
                                    ))
                                }
                            </select>
                            <h1 className='' 
                            onClick={()=>{
                                setBlur(false)
                                setShowSearch(true)
                                setCategory("All")
                                setTimeout(() => {
                                    inputBox.current?.focus()
                                }, 1);
                            }
                                }
                            ><i class="ri-search-2-line"></i></h1>
                        </div>
                    </div>
                    {
                        allBlogs.length ? (
                            <div className={`flex flex-wrap gap-10 max-md:justify-center ${blur? 'opacity-40':''}`} onClick={() => {setBlur(false)}}>
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
                                        category={blog.category}
                                    />
                                ))
                            }
                        </div>
                        ):(
                            <div className='min-h-screen w-full flex justify-center items-start mt-[20vh]'>
                            <h2 className='text-5xl font-bold font-mono'>No Such Blog !</h2>
                            </div>
                        )
                    }
                </div>
            )
            }
            </div>
        </Container>
    </div>
    )
}

export default AllPost
