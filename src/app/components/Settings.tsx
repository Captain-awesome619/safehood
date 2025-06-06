import React, { useState } from 'react'
import { useGlobalContext } from '../context/GlobalProvider'
import { useRouter } from 'next/navigation'
import { signOut } from '../lib/appwrite'
import { ClipLoader } from 'react-spinners'
import { motion } from 'framer-motion';
import { Dialog } from 'radix-ui';
import { FaWhatsappSquare } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Settings = () => {
    const navigate = useRouter()
    const { user, setUser, setIsLogged } = useGlobalContext();
const [uploading , setUploading] = useState<boolean>(false)
     const logout = async () => {
        setUploading(true)
        await signOut();
        setUser(null);
        setIsLogged(false);
        navigate.push("/");
        setUploading(false)

      };
  return (
    <div className='grid gap-[2rem]'>
      
     
      

<Dialog.Root >
    <Dialog.Trigger >
      <button
                    className='flex items-start cursor-pointer font-[600] bg-primary1 rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-secondary'
    
                  >
                    {uploading ?  <ClipLoader size={25} color='#CDE0FF'  className='text-white' /> : "Support "}
                  </button>
      
<Dialog.Overlay >
     <motion.div
   className="fixed w-screen inset-0 duration-1000 backdrop-blur-md   "
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  />
     </Dialog.Overlay>
</Dialog.Trigger>
 <Dialog.Content aria-description='form' className='  h-max p-[2rem] lg:py-[1rem] lg:px-[3rem]   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  flex flex-col items-center justify-center gap-[1.5rem] bg-white  rounded-3xl ' >
<Dialog.Title className='hidden'>Settings</Dialog.Title>
<div className='px-[2rem] py-[1rem] flex flex-row lg:gap-[3rem] gap-[2rem] items-center justify-center'>
     <a  href="mailto:Anjieroja@gmail.com" target="_blank" rel='noreferrer'><SiGmail   size={25} className='cursor-pointer'  /> </a>
 <a href="https://Wa.me/+2347068597323" target="_blank" rel='noreferrer'><FaWhatsappSquare size={30}  className='cursor-pointer'/></a>
</div>
</Dialog.Content>
</Dialog.Root>


 <div>
      <button
                    className='cursor-pointer font-[600]  bg-primary1 rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary2'
                    onClick={logout}
                    disabled={uploading}
                  >
                    {uploading ?  <ClipLoader size={25} color='#CDE0FF'  className='text-secondary' /> : "Log Out "}
                  </button>
      </div>

<div>
      <button
                    className='cursor-pointer font-[600] bg-red-600 rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary2'
    
                  >
                    {uploading ?  <ClipLoader size={25} color='#CDE0FF'  className='text-secondary' /> : "Delete Account "}
                  </button>
      </div>

    </div>
  )
}

export default Settings
