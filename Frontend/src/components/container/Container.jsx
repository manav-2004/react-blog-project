import React from 'react'

function Container({children, extraCss = ""}) {
    return <div className={`w-full max-w-7xl mx-auto px-2 ${extraCss} dark:bg-gray-900`}>{children}</div>;
}

export default Container