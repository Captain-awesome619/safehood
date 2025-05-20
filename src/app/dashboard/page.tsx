'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { GiHamburgerMenu } from "react-icons/gi"
import { IoMdClose } from "react-icons/io"
import Feed from '../components/Feed'
import LiveFeed from '../components/LiveFeed'
import Chats from '../components/Chats'
import Report from '../components/Report'
import Logo from '../../assets/logo2.svg'
import { ClipLoader } from 'react-spinners'
import Profile from '../components/profile'
import { signOut } from '../lib/appwrite'
import { useGlobalContext } from '../context/GlobalProvider'
import { useRouter } from 'next/navigation'
import { appwriteConfig } from '../lib/appwrite'
import { storage } from '../lib/appwrite'
import Settings from '../components/Settings'
import dynamic from 'next/dynamic'

export default function DashboardLayout() {
   const navigate = useRouter()
  const [activePage, setActivePage] = useState<string>('Feed')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, setUser, setIsLogged } = useGlobalContext();
  
const [PicUrl, setPicUrl] = useState<string>('');

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [sidebarOpen])
  

 const getProfilePictureUrl = async (fileId: string) => {
    try {
      const file = await storage.getFileView(appwriteConfig.storageId, fileId);
      setPicUrl(file.href);
      return file.href;
    } catch (error) {
      console.error("Error fetching profile picture URL:", error);
      return null;
    }
  };

  useEffect(() => {
    if (user?.picture ) {
      // Only try to fetch the picture if a pic ID exists
      getProfilePictureUrl(user?.picture);
    }
  }, [user]); // Re-run when the `pic` prop changes


  return (
    <div className="flex h-screen pb-[1rem] lg:pb-0 w-full  overflow-hidden bg-secondary bg-cover bg-bottom pt-[3rem]">
     
      <div className="hidden md:flex fixed top-0 left-0 h-full  z-30 flex-col p-4 pt-[0rem]">
      <Image 
     src={Logo}
     height={50}
     width={50}
     alt="logo"
     className="lg:w-[200px] lg:h-[100px] w-[80px] h-[50px] mb-[2rem]"
     />
        <nav className="flex flex-col justify-between h-screen gap-6 text-gray-700">
        <div className='flex flex-col gap-6 '>
          <button onClick={() => setActivePage('Feed')} className={`text-left ${activePage === 'Feed' ?'text-white cursor-pointer  font-[600] text-[30px] ' : ' cursor-pointer  text-primary1 font-[600]  text-[30px]'}`}>Feed</button>
          <button onClick={() => setActivePage('Live')} className={`text-left ${activePage === 'Live' ? 'text-white cursor-pointer  font-[600] text-[30px] ' : 'cursor-pointer   text-primary1 font-[600]  text-[30px]'}`}>Live Activities</button>
          <button onClick={() => setActivePage('Chats')} className={`text-left ${activePage === 'Chats' ?'text-white  cursor-pointer font-[600] text-[30px] ' : 'cursor-pointer   text-primary1 font-[600]  text-[30px]'}`}>Chats</button>
          <button onClick={() => setActivePage('Report')} className={`text-left ${activePage === 'Report' ? 'text-white cursor-pointer font-[600] text-[30px] ' : ' cursor-pointer  text-primary1 font-[600]  text-[30px]'}`}>Make a report</button>
      
          </div>
          <div className='pb-[3rem] flex flex-col gap-[1rem]'>
          <button onClick={() => setActivePage('Profile')} className={`text-left ${activePage === 'Profile' ? 'text-white cursor-pointer font-[600] text-[30px] ' : ' cursor-pointer  text-primary1 font-[600]  text-[30px]'}`}>Profile</button>
          <button onClick={() => setActivePage('Settings')} className={`text-left ${activePage === 'Settings' ? 'text-white cursor-pointer font-[600] text-[30px] ' : ' cursor-pointer  text-primary1 font-[600]  text-[30px]'}`}>Settings</button>
          </div>
        </nav>
      </div>

      {/* Mobile Overlay with blur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`z-100 fixed top-0 left-0 h-screen w-64 shadow-md bg-secondary  p-4 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 ">
        <Image 
     src={Logo}
     height={50}
     width={50}
     alt="logo"
     className="lg:w-[200px] lg:h-[100px] w-[100px] h-[50px]"
     />
          <IoMdClose size={30} onClick={() => setSidebarOpen(false)} className='text-primary1' />
        </div>
        <nav className=" flex flex-col justify-between  w-64 gap-[1rem] text-gray-700">
        <div className='flex flex-col gap-6 '>
          <button onClick={() => setActivePage('Feed')} className={`text-left ${activePage === 'Feed' ?'text-white cursor-pointer  font-[600] text-[30px] ' : ' cursor-pointer  text-primary1 font-[600]  text-[30px]'}`}>Feed</button>
          <button onClick={() => setActivePage('Live')} className={`text-left ${activePage === 'Live' ? 'text-white cursor-pointer  font-[600] text-[30px] ' : 'cursor-pointer   text-primary1 font-[600]  text-[30px]'}`}>Live Activities</button>
          <button onClick={() => setActivePage('Chats')} className={`text-left ${activePage === 'Chats' ?'text-white  cursor-pointer font-[600] text-[30px] ' : 'cursor-pointer   text-primary1 font-[600]  text-[30px]'}`}>Chats</button>
          <button onClick={() => setActivePage('Report')} className={`text-left ${activePage === 'Report' ? 'text-white cursor-pointer font-[600] text-[30px] ' : ' cursor-pointer  text-primary1 font-[600]  text-[30px]'}`}>Make a report</button>
      
          </div>
          <div className=' flex flex-col gap-[1rem] '>
          <button onClick={() => setActivePage('Profile')} className={`text-left ${activePage === 'Profile' ? 'text-white cursor-pointer font-[600] text-[30px] ' : ' cursor-pointer  text-primary1 font-[600]  text-[30px]'}`}>Profile</button>
          <button onClick={() => setActivePage('Settings')} className={`text-left ${activePage === 'Settings' ? 'text-white cursor-pointer font-[600] text-[30px] ' : ' cursor-pointer  text-primary1 font-[600]  text-[30px]'}`}>Settings</button>
          </div>
        </nav>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '0', marginTop: '0' }}>
        {/* Topbar */}
        <header className="fixed  top-0 left-0 right-0 pt-[1rem] lg:pt-[3rem]  flex items-center justify-between px-4 md:pl-72 md:pr-6 z-20">
          <div className="flex items-center gap-3 w-full">
            <GiHamburgerMenu size={30} className="md:hidden text-primary1" onClick={() => setSidebarOpen(true)} />
            <div className="flex-grow items-start  justify-start max-w-lg hidden sm:block">
              <input
                type="text"
                placeholder="Search Safehood"
                className= "text-[#0D357561] w-full bg-secondary border-primary1  border-[7px] rounded-4xl px-4 py-2 focus:outline-none focus:ring-2 "
              />
            </div>
          </div>
          <div className='rounded-[50%] border-[8px] border-primary1'>
          {user?.picture && PicUrl ? (
  PicUrl ? (
    <Image
      width={50}
      height={50}
      src={PicUrl}
      alt='avatar'
      className='lg:w-[40px] lg:h-[40px] w-[30px] h-[30px] rounded-[50%] items-center justify-center'
    />
  ) : <ClipLoader size={25} className='text-primary1' />
) : user?  (
  <Image
    width={50}
    height={50}
    src={user.avatar}
    alt='avatar'
    className='lg:w-[50px]  bg-primary1 lg:h-[50px]  rounded-[50%] items-center justify-center '
  />
) : <ClipLoader size={25}   className='text-primary1'/>}
          </div>
        </header>
 
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 pt-20 md:pl-72">
      
        {activePage === 'Profile' && (
           <Profile user={user} id={user?.$id}  pic={user?.picture} />
          )}
          {activePage === 'Feed' && (
             <Feed />
          )}
          {activePage === 'Live' && (
            <LiveFeed />
          )}
          {activePage === 'Chats' && (
             <Chats />
          )}
          {activePage === 'Report' && (
           <Report />
          )}
          {activePage === 'Settings' && (
           <Settings />
          )}
        </main>
      </div>
    </div>
  )
}
