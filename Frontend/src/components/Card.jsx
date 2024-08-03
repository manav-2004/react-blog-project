import React from 'react'
import { Link } from 'react-router-dom'

function Card({
    title,
    id,
    image,
    ownerImage
}) {
  return (
    <Link to={`/blog/${id}`}>
        <div className= {`shadow-lg flex flex-col items-center w-[260px] h-[280px] rounded-xl relative hover:w-[290px] hover:h-[300px] hover:shadow-2xl ${ownerImage === undefined ?'gap-8' :'gap-4'}`}>
            <div className='h-32 w-52 overflow-hidden rounded-2xl flex justify-center items-center mt-8'>
              <img src={image} alt="" />
            </div>
            <h2 className='text-lg'>{title[0].toUpperCase()+ title.slice(1,title.length)}</h2>
            {
              ownerImage === undefined ? null : (
                <div className='w-full flex justify-end px-4 py-2'>
                <img src={ownerImage || "https://image.spreadshirtmedia.com/image-server/v1/products/T1459A839PA3861PT28D1033654565W6120H10000/views/1,width=800,height=800,appearanceId=839,backgroundColor=F2F2F2/cool-question-mark-sticker.jpg"} className='h-12 aspect-square 
                rounded-full hover:absolute hover:h-24 hover:z-10'/>
              </div>
              ) 
            }
        </div>
    </Link>
  )
}

export default Card