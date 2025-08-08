import { useEffect, useState } from "react"
import { Authorize } from "./services/auth.services"
import {useDispatch} from 'react-redux'
import { login, logout } from "./features/authSlice"
import {Outlet, useLocation } from "react-router-dom"
import { Footer, Header, Loader } from "./components"
import UserProfile from "./pages/UserProfile"
import { Bounce, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import 'remixicon/fonts/remixicon.css'


// The entire React component tree is reevaluated 
// on route changes, allowing conditional logic to determine what is shown or hidden.
function App() {

  const [loading, setLoading] = useState(true)

  const [status, setStatus] = useState(false);

  const [showWarmUpMessage, setShowWarmUpMessage] = useState(false)

  const dispatch = useDispatch()

  const location = useLocation()

  useEffect(()=>{

    Authorize.getUser()
    .then((res)=>{
      dispatch(login({data : res.data}))
      setStatus(true);
    })
    .catch((err)=>{
      dispatch(logout());
    })
    .finally(()=>{
      setLoading(false);
    })

  },[])

  useEffect(()=>{

    Authorize.toggleStatus({status})

  },[status])

  useEffect(()=>{
    const fn = () => {
      Authorize.toggleStatus({status : false})
    }

    window.addEventListener('beforeunload', fn)

    return () => {
      window.removeEventListener('beforeunload', fn)
    }
  }, [])
  

  useEffect(() => {
    
    let time;
    if (loading){
      time = setTimeout(() => {
        setShowWarmUpMessage(true);
      }, 2000);
    } 

    return () => clearTimeout(time);
  }, [loading]);

  const arr = ["/login", "/signUp", "/forgot-password"]


  const renderHeaderAndFooter = !arr.includes(location.pathname) && !location.pathname.startsWith("/reset-password")

  useEffect(()=>{
    window.scrollTo(0,0)
  },[location])

  return loading ? (
      <div>
        <Loader />
        {showWarmUpMessage && (
          <div className="fixed bottom-0 left-0 right-0 bg-cyan-700 text-white text-center p-2">
            Warming up the server, please wait...
          </div>
        )}
      </div>
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
        {renderHeaderAndFooter && <Header/>}
        <main>
          <Outlet/>
        </main>
        {renderHeaderAndFooter && <Footer/>}
      </div>
    </div>
  )

}
export default App
