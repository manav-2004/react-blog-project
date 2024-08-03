import React, { useState } from 'react'

function Select({
    options,
    className = "",
    ...props
}, ref) {


  return (
    <div className='w-full mt-10'>
        <select className={`px-3 py-2 rounded-lg bg-white text-black outline-none
                focus:bg-slate-50 duration-200 border border-gray-200 w-full ${className}`}
                ref={ref} {...props}>
            {
                options?.map((option)=>(
                    <option key={option.name} value={option.value} className={`${option.color}`}>
                        {option.name}
                    </option>
                ))
            }            
        </select>
    </div>
  )
}

export default React.forwardRef(Select)