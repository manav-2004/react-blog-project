import { useEffect, useState } from "react"
import { Authorize } from "./services/auth.services"
import {useDispatch} from 'react-redux'
import { login, logout } from "./features/authSlice"
import {Outlet, useLocation } from "react-router-dom"
import { Footer, Header, Loader } from "./components"
import { Profile } from "./pages"
import { Bounce, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import 'remixicon/fonts/remixicon.css'


// The entire React component tree is reevaluated 
// on route changes, allowing conditional logic to determine what is shown or hidden.
function App() {

  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()

  const location = useLocation()

  useEffect(()=>{

    Authorize.getUser()
    .then((res)=>{
      dispatch(login({data : res.data}))
    })
    .catch((err)=>{
      dispatch(logout())
    })
    .finally(()=>setLoading(false))

  },[])

  const renderHeaderAndFooter = (location.pathname === '/login')||(location.pathname === '/signUp')


  return loading ? (
      <Loader/>
  ) : (
    <div className="min-h-screen w-full font-bold font-mono relative">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition: Bounce
      />

      <div className="w-full block">
        {!renderHeaderAndFooter && <Header/>}
        <main>
          <Outlet/>
          {/* <Profile/> */}
        </main>
        {!renderHeaderAndFooter && <Footer/>}
      </div>
    </div>
  )

}
export default App
