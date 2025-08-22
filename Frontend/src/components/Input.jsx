import React, { useId } from 'react'


const Input = React.forwardRef(({
    label,
    type = "text",
    className = "",
    labelClass = "",
    topDivClass = "w-full",
    fn = ()=>{},
    ...props

}, ref)=>{

    const id = useId()
    return (
    <div className={`mt-8 ${topDivClass} `}>
            {
                label && <label className={`inline-block mb-1 pl-1 ${labelClass}`} htmlFor={id}>
                            {label}
                        </label>
            }
            <input type={type} id={id} className={`px-3 py-2 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white outline-none
                focus:bg-slate-50 dark:focus:bg-gray-800 duration-200 border border-gray-200 dark:border-gray-700 w-full  
                ${className}`} ref={ref} onChange={(e)=>{fn(e)}} {...props} />
        </div>
    )
})

export default Input