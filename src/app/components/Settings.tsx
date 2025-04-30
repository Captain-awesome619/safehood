import React, { useState } from 'react'
import { useGlobalContext } from '../context/GlobalProvider'
import { useRouter } from 'next/navigation'
import { signOut } from '../lib/appwrite'
import { ClipLoader } from 'react-spinners'
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
