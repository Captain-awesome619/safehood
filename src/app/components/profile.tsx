'use client'
import React from 'react'
import { RxAvatar } from "react-icons/rx";


const Profile = () => {
  return (
    <div className='flex flex-col '>
       <div className=' p-[1rem]  lg:p-[0.5rem] lg:gap-0 gap-[1rem] flex flex-col bg-primary1 items-center  rounded-3xl lg:w-[600px] lg:h-[300px]'>
       <div className="bg-[url('/images/profilebg.svg')] bg-cover bg-bottom w-full h-[180px] rounded-2xl" ></div>
       <div className='flex w-full pb-[0.5rem] lg:pb-0 items-center m-auto justify-between'>
       <div className='flex flex-col ml-[1rem] mt-[-3.5rem] lg:mt-[-5rem] '>
       <div className='rounded-[50%] border-[8px] flex items-center justify-center border-primary1'>
         <RxAvatar 
         size={70}
          color='white'
          />
          </div>
          <h3 className='font-[600] text-primary2 text-[16px] lg:text-[20px]'>Username</h3>
       </div>
       <div>
       <button  className='cursor-pointer font-[600] bg-secondary rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary1'>
Upload picture
     </button>
     </div>
       </div>
       
       </div>

    </div>
  )
}

export default Profile
