import { useState } from "react"


function App() {

  const [val , setVal] = useState("")
  const [slug, setSlug] = useState("")

  const handleChange = (e)=>{
    const data = e.target.value
    const slugData = data.split(" ").join("-")
    setVal(data)
    setSlug(slugData)
  }

  return (
    <div className="bg-black h-screen w-full flex justify-center items-center gap-2 font-bold">
      <input type="text"  value={val} onChange={handleChange} className="outline-none"/>
      <input type="text" value={slug} readOnly className="outline-none"/>
    </div>
  )
}

export default App
