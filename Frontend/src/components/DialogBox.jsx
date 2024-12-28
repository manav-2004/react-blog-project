import React from 'react'

function DialogBox({
    content = "are you sure you want to delete this post.",
    trueFn = ()=>{},
    falseFn = ()=>{}
}) {
  return (
    <div
        className='w-full h-[calc(100vh-112px)] absolute z-30 flex justify-center items-center top-0 left-0'
    >
        <div className='w-[300px] shadow-lg shadow-slate-400 rounded-lg py-4 px-6 font-mono font-semibold text-slate-700 flex flex-col gap-4 bg-white'>
            <h1>{content[0].toUpperCase() + content.slice(1,content.length)}</h1>
            <div className='flex gap-2 justify-end'>
                <button className='bg-cyan-600 text-white font-semibold py-1 px-2 rounded-md' onClick={trueFn}>Yes</button>
                <button className='bg-red-500 text-white font-semibold py-1 px-2 rounded-md' onClick={falseFn}>No</button>
            </div>
        </div>
    </div>
  )
}

export default DialogBox