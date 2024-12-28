import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import {store} from "./store/store.js"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Protected } from "./components"
import {AddPost, AllPost, Blog,EditPost, Home, LogIn, MyPost, SignUp,Profile, ChangePassword} from "./pages"


const router = createBrowserRouter([
  {
    path : "/",
    element : <App/>,
    children : [
      {
        path : "/",
        element : <Home/>
      },
      {
        path : "/login",
        element : (
          <Protected authentication={false}>
              <LogIn/>
          </Protected>
        )
      },
      {
        path : "/signUp",
        element : (
          <Protected authentication={false}>
            <SignUp/>
          </Protected>
        )
      },
      {
        path : "/profile",
        element : (
          <Protected authentication>
            <Profile/>
          </Protected>
        )
      },
      {
        path : "/change-password",
        element : (
          <Protected authentication>
            <ChangePassword/>
          </Protected>
        )
      },
      {
        path : "/add-blog",
        element : (
          <Protected authentication>
            <AddPost/>
          </Protected>
        )
      },
      {
        path : "/edit-blog/:id",
        element : (
          <Protected authentication>
            <EditPost/>
          </Protected>
        )
      },
      {
        path : "/all-blogs",
        element : (
            <AllPost/>
        )
      },
      {
        path : "/my-blogs",
        element : (
          <Protected authentication>
            <MyPost/>
          </Protected>
        )
      },
      {
        path : "/blog/:id",
        element : (
            <Blog/>
        )
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <RouterProvider router={router}/>
  </Provider>
)
