import React, { useState, useEffect, useRef } from 'react';
import { RxAvatar } from "react-icons/rx";
import { storage, databases, appwriteConfig } from '../lib/appwrite';
import { ID } from "appwrite";
import Image from 'next/image';
import { ClipLoader } from 'react-spinners';
import { getUserPosts } from '../lib/appwrite';
import { FaLocationDot } from "react-icons/fa6";

interface Props {
  user: any;
  id: string;
  pic: string;
}

const Profile = ({ user, id, pic }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [PicUrl, setPicUrl] = useState<string>('');
  const [data,setdata] = useState <any>()
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
    if (!id ) {
      console.warn('Invalid or missing id prop:', id);
      return; 
    } else{
      const fetchPosts = async () => {
        try {
          const posts = await getUserPosts(id);
          console.log("Fetched posts:", posts); // check if it's always the same
          setdata(posts);
        } catch (error) {
          console.log("Fetching user posts failed:", error);
        }
      };
    fetchPosts();
  }
  }, [id]);
  
  
  useEffect(() => {
    if (user?.picture ) {
      getProfilePictureUrl(pic);
    }
  }, [pic ]); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    try {
      setUploading(true);
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
    
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        id,
        {
          picture: uploadedFile.$id,
        }
      );
      window.location.reload()
      setFile(null); // Reset file input
      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };
  const getColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'red':
        return 'bg-red-500 shadow-[0_0_10px_4px_rgba(239,68,68,0.6)]'; // red-500
      case 'amber':
      case 'yellow':
        return 'bg-amber-500 shadow-[0_0_10px_4px_rgba(245,158,11,0.6)]'; // amber-500
      case 'pink':
        return 'bg-pink-500 shadow-[0_0_10px_4px_rgba(236,72,153,0.6)]'; // pink-500
      default:
        return 'bg-gray-500 shadow-[0_0_10px_4px_rgba(107,114,128,0.6)]'; // gray-500
    }
  };
  return (
    <div className='flex flex-col lg:gap-[3rem] gap-[2rem]  '>
    
      <div className='p-[1rem] lg:p-[0.5rem] lg:gap-0 gap-[1rem] flex flex-col bg-primary1 items-center rounded-3xl lg:w-[600px] lg:h-[300px]'>
        <div className="bg-[url('/images/profilebg.svg')] bg-cover bg-bottom w-full h-[180px] rounded-2xl"></div>
        <div className='flex w-full pb-[0.5rem] lg:pb-0 items-center m-auto justify-between'>
          <div className='flex flex-col ml-[1rem] mt-[-3.5rem] lg:mt-[-4rem] items-center justify-center'>
            <div className='rounded-[50%] border-[8px] lg:mb-[1rem] flex items-center justify-center border-primary1'>
            {user?.picture && PicUrl ? (
  PicUrl ? (
    <Image
      width={50}
      height={50}
      src={PicUrl}
      alt='avatar'
      className='w-[100px] h-[90px] rounded-[50%] items-center justify-center'
    />
  ) : <ClipLoader size={25} className='text-primary1' />
) : user?.avatar ? (
  <Image
    width={50}
    height={50}
    src={user.avatar}
    alt='avatar'
    className='w-[50px] h-[50px] rounded-[50%] items-center justify-center text-black'
  />
) : <ClipLoader size={25}  className='text-primary1' />}
            </div>
            <h3 className='font-[600] text-primary2 text-[17px] lg:text-[20px]'>{user?.username}</h3>
          </div>
          <div className='lg:mt-[-2.2rem]'>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className='hidden' />
            {!file ? (
              <button
                className='cursor-pointer font-[600] bg-secondary rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary1'
                onClick={handleButtonClick}
              >
                Edit profile
              </button>
            ) : (
              <button
                className='cursor-pointer font-[600] bg-secondary rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary1'
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ?  <ClipLoader size={25}  className='text-primary1' /> : "Upload Picture"}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='w-max pl-[1rem] pt-[0.5rem] h-[80px] pr-[3rem] bg-primary1 rounded-3xl grid  ' >
      <h2 className='text-white font-[600] lg:text-[20px] text-[16px] '>Number of posts</h2>
      {data?
        <h2 className='text-white font-[600] lg:text-[20px] text-[16px] '>{data?.length}</h2>
    :
     <ClipLoader size={25}  className='text-primary1' />
      }
    
      </div >
      <div  className=' bg-primary1 w-[100%]  lg:w-[80%] px-[3rem] py-[2rem] h-max grid gap-[1.5rem] rounded-2xl'>
{data? 
      <div className='  grid gap-[1.5rem]'>
         <h3 className='flex items-center  text-primary2 lg:text-[18px] text-[16px] font-[600] '>Your  posts </h3>
      {data?.map((post:any, index:number) => (
 <div className='grid rounded-3xl bg-secondary gap-[1rem] lg:gap-[1.5rem] py-[1rem] px-[2rem] w-[100%]  lg:w-[500px] ' key={post.$id || index}>
         <div className='flex items-center justify-between'>
  <h3 className='text-primary1 lg:text-[18px] text-[17px] font-[600]' >{post.category}</h3>
  <div className={`w-[22px] h-[22px] rounded-[50%]  shadow-[0px_4px_8px_rgba(255,0,0,0.7)] ${getColor(post.color)}`}>
      </div>
      </div>
      <div className='flex items-center gap-[0.2rem]'>
      <FaLocationDot size={15} className='text-primary1' />
      <h4 className='text-primary1 lg:text-[16px] text-[14px] font-[400]'>{post.location}</h4>
      </div>
      <div  className='lg:h-[200px] lg:w-[100%] w-[100%] h-[130px]' style={{
        backgroundImage: `url(${post.thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
       
      }}>
      </div>
      <div className='grid gap-[rem]'>
      <h2 className='text-primary1 lg:text-[25px] text-[18px] font-[600]'>{post.description}</h2>
      <h2 className='text-primary1 lg:text-[16px] text-[14px] font-[400]'>{post.description}</h2>
      </div>
      </div>
))}
      </div>
      :
      <h3 className='flex items-center justify-center text-primary2 lg:text-[25px] text-[18px] font-[600] '>You have no posts yet</h3>
}
</div>
    </div>
  );
};
export default Profile;
