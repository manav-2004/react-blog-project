import React, { useEffect } from 'react'
import Container from '../components/container/Container'
import {useNavigate} from 'react-router-dom'
import DialogBox from '../components/DialogBox'


function Home() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navigate = useNavigate()

  return (
    <div className="bg-white dark:bg-gray-900">
        <Container>
            <div className="w-full">
                <section className="relative overflow-hidden py-20 dark:bg-gray-900">
                    <div className="relative">
                    <div className="mx-auto max-w-xl lg:max-w-7xl">
                        <div className="mx-auto mb-14 max-w-2xl text-center">
                        <span className="mb-4 inline-block rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-black dark:text-white">
                            OUR BLOG
                        </span>
                        <h1 className="text-5xl font-bold dark:text-white">Your Voice, Amplified</h1>
                        </div>
                        <div className="my-18 -mx-4 flex flex-wrap px-4">
                        <div className="mb-12 w-full px-4 lg:mb-0 lg:w-1/2">
                            <a className="group block w-full" href="#">
                            <img
                                className="mb-5 block w-full rounded-lg"
                                src="https://plus.unsplash.com/premium_photo-1663852297654-56d979cf72d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8YmxvZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                                alt=""
                            />
                            <span className="mb-5 block text-gray-500 dark:text-gray-400 opacity-0">Jul 20, 2023</span>
                            <h4 className="mb-5 text-3xl font-semibold text-gray-900 dark:text-white">
                            A space to share your thoughts and connect with the world
                            </h4>
                            <p className="max-w-xl text-lg text-gray-500 dark:text-gray-300">
                            Welcome to your space for expression. Share your thoughts, connect with a global audience, and inspire meaningful conversations. Start your journey today and let your voice be heard!
                            </p>
                            </a>
                        </div>
                        <div className="w-full px-4 lg:w-1/2">
                            <a className="group mb-8 md:flex" href="#">
                            <img
                                className="h-40 w-48 rounded-lg"
                                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                alt=""
                            />
                            <div className="my-4 pt-2 md:ml-6 md:mt-0">
                                <span className="mb-2 block text-gray-500 dark:text-gray-400 opacity-0">Jul 20, 2022</span>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Express yourself, inspire others, and make an impact.
                                </h4>
                            </div>
                            </a>
                            <a className="group mb-8 md:flex" href="#">
                            <img
                                className="h-40 w-48 rounded-lg"
                                src="https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                alt=""
                            />
                            <div className="my-4 pt-2 md:ml-6 md:mt-0">
                                <span className="mb-2 block text-gray-500 opacity-0">Jul 20, 2022</span>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Turning ideas into impactful stories that reach the world
                                </h4>
                            </div>
                            </a>
                            <a className="group mb-8 md:flex" href="#">
                            <img
                                className="h-40 w-48 rounded-lg"
                                src="https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                alt=""
                            />
                            <div className="my-4 pt-2 md:ml-6 md:mt-0">
                                <span className="mb-2 block text-gray-500 opacity-0">Jul 20, 2022</span>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                A platform for thinkers, writers, and dreamers like you.
                                </h4>
                            </div>
                            </a>
                        </div>
                        </div>
                        <div className="mt-14 text-center">
                        <button
                            type="button"
                            className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                            dark:border-white dark:text-white"
                            onClick={()=>{navigate("/all-blogs")}}
                        >
                            View All Posts
                        </button>
                        </div>
                    </div>
                    </div>
                </section>
                <hr className="my-8" />
            </div>
        </Container>
    </div>
  )
}

export default Home