import React from 'react'
import logo from '/logo2.png'
import Container from '../container/Container'

function Footer() {
  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <Container>
        <div className='w-full h-64 flex gap-0 font-bold font-mono cursor-pointer border-t-[3px] dark:border-gray-700 max-sm:flex-col'>
          <div className='w-1/2 flex justify-center items-center'>
            <img src={logo} alt="logo" className='h-32 aspect-auto drop-shadow-xl' />
          </div>
          <div className='w-3/4 flex gap-20 items-center justify-center max-sm:flex-col'>
            <div className='topBox'>
              <h2 className='text-gray-400 dark:text-gray-300 mb-6'>Company</h2>
              <h2 className='dark:text-gray-200'>Features</h2>
              <h2 className='dark:text-gray-200'>Pricing</h2>
              <h2 className='dark:text-gray-200'>Affiliate Programing</h2>
              <h2 className='dark:text-gray-200'>Press Kit</h2>
            </div>
            <div className='topBox'>
              <h2 className='text-gray-400 dark:text-gray-300 mb-6'>Support</h2>
              <h2 className='dark:text-gray-200'>Account</h2>
              <h2 className='dark:text-gray-200'>Help</h2>
              <h2 className='dark:text-gray-200'>Contact Us</h2>
              <h2 className='dark:text-gray-200'>Customer Support</h2>
            </div>
            <div className='topBox'>
              <h2 className='text-gray-400 dark:text-gray-300 mb-6'>Legals</h2>
              <h2 className='dark:text-gray-200'>Terms & Conditions</h2>
              <h2 className='dark:text-gray-200'>Privacy Policy</h2>
              <h2 className='dark:text-gray-200'>Licensing</h2>
              <h2 className='opacity-0'>.</h2>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Footer