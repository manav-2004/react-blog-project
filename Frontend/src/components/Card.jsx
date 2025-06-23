import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Card({
    title = "",
    id = "",
    image = "",
    ownerImage = null,
    fullname="Anonymous",
    parsedContent="",
    deletePost = ()=>{},
    category,
    userId = null
}) {

  const [content, setContent] = useState("");
  ["All","Tech","Lifestyle","Business","Education","Entertainment","Health","Others"]
  const color = {
    "Tech" : "bg-red-400",
    "Lifestyle" : "bg-yellow-300",
    "Business" : "bg-orange-400",
    "Education" : "bg-pink-400",
    "Entertainment" : "bg-green-400",
    "Health" : "bg-cyan-400",
    "Others" : "bg-slate-400",
  }

  const co = "bg-cyan-400";
  const navigate = useNavigate()

  useEffect(()=>{
  
    const ct = new DOMParser().parseFromString(parsedContent, 'text/html');
    setContent(ct.body.textContent.toString())

  },[])

  return (
      <div className='w-[260px] h-[350px] shadow-md shadow-slate-400 rounded-lg flex flex-col overflow-hidden cursor-pointer'>
        <div className='w-full overflow-hidden h-[45%]' onClick={()=>{navigate(`/blog/${id}`)}}><img src={image} alt="" /></div>
        <div className='h-[55%] w-full flex flex-col p-2 px-3 gap-2'>
          <div>
          <p className={`text-[11px] text-white px-4 rounded-lg inline-block ${color[category]}`}>{category}</p>
          </div>
          <h1 className='font-mono text-xl font-semibold text-slate-800 mt-1' onClick={()=>{navigate(`/blog/${id}`)}}>{title[0].toUpperCase() + title.slice(1,title.length)}</h1>
          <p className='text-sm font-bold text-slate-700 tracking-tighter min-h-10' onClick={()=>{navigate(`/blog/${id}`)}}>{content[0]?.toUpperCase()+content.slice(1,Math.min(50,content.length))} ...</p>
          <div className={`flex ${ownerImage ? 'justify-start':'justify-end'} mt-4 w-full items-center`}>
            {
              ownerImage ? (
                <div className='flex gap-2'>
                  <img src={ownerImage} className='rounded-full h-10 aspect-square' onClick={()=>{userId && navigate(`/user-profile/${userId}`)}}/>
                  <h2 className='text-slate-600'>{fullname[0].toUpperCase()+fullname.slice(1,fullname.length)}</h2>
                </div>
              ):(
                <button onClick={()=>{deletePost(id)}}>
                  <i className="ri-delete-bin-5-line text-2xl font-medium"></i>
                </button>
              )
            }
          </div>
        </div>
      </div>
  )
}

export default Card

{/* <div className= {`shadow-lg flex flex-col items-center w-[260px] h-[280px] rounded-xl relative ${ownerImage === undefined ?'gap-8' :'gap-4'}`}>
<div className='h-32 w-52 overflow-hidden rounded-2xl flex justify-center items-center mt-8'>
  <img src={image} alt="" />
</div>
<h2 className='text-lg'>{title[0].toUpperCase()+ title.slice(1,title.length)}</h2>
<p className='text-sm font-medium'>{content[0].toUpperCase()+ content.slice(1,content.length)}</p>
{
  ownerImage === undefined ? null : (
    <div className='w-full flex justify-start px-4 py-2'>
    <img src={ownerImage || "https://image.spreadshirtmedia.com/image-server/v1/products/T1459A839PA3861PT28D1033654565W6120H10000/views/1,width=800,height=800,appearanceId=839,backgroundColor=F2F2F2/cool-question-mark-sticker.jpg"} className='h-12 aspect-square 
    rounded-full'/>
    <h2 className='ml-2 text-slate-700'>{fullname}</h2>
    </div>
  ) 
}
</div> */}