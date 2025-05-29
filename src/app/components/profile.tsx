import React, { useState, useEffect, useRef } from 'react';
import { deletePost } from '../lib/appwrite';
import { storage, databases, appwriteConfig,account } from '../lib/appwrite';
import { ID } from "appwrite";
import Image from 'next/image';
import { ClipLoader } from 'react-spinners';
import { getUserPosts } from '../lib/appwrite';
import { FaLocationDot } from "react-icons/fa6";
import { Dialog } from 'radix-ui';
import { motion } from 'framer-motion';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Query } from 'appwrite';
import { updateUsername } from '../lib/appwrite';
import { IoTrashBin } from "react-icons/io5";
import star from '../../assets/verified.svg'
interface Props {
  user: any;
  id: string;
  pic: string;}

const Profile = ({ user, id, pic }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [PicUrl, setPicUrl] = useState<string>('');
  const [data,setdata] = useState <any>()
  const [profile,setprofile] = useState <any>('')
  const [documentid,setdocumentid] = useState <any>('')
  const [username,setusername] = useState <any>('')

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
      setFile(null); 
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
        return 'bg-red-500 shadow-[0_0_10px_4px_rgba(239,68,68,0.6)] text-red-500'; // red-500
      case 'amber':
        return 'bg-amber-500 shadow-[0_0_10px_4px_rgba(245,158,11,0.6)] text-amber-500'; // amber-500
      case 'pink':
        return 'bg-pink-500 shadow-[0_0_10px_4px_rgba(236,72,153,0.6)] text-pink-500'; // pink-500
      case 'yellow':
        return 'bg-yellow-500 shadow-[0_0_10px_4px_rgba(234,179,8,0.6)]text-yrllow-500'; // yellow-500
      default:
        return 'bg-gray-500 shadow-[0_0_10px_4px_rgba(107,114,128,0.6)] text-gray-500'; // gray-500
    }
  };
  async function getUserDocumentId() {
    try {
      const session = await account.get();
    
      const response = await databases.listDocuments(
        user?.$databaseId,
        user?.$collectionId,
        [Query.equal('email', session.email)]
      );
  
      if (response.documents.length > 0) {
        setdocumentid(response.documents[0].$id)
        return response.documents[0].$id;
      } else {
        throw new Error('User document not found.');
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
      throw error;
    }
  }
  useEffect(() => {
    if ( user?.$collectionId ) {
      getUserDocumentId();
    }
  }, [user]); 
  const handleUsernameUpdate = async () => {
    if (username === '') {
      alert('enter a username')
      return
    }
    else{
      setUploading(true)
    try {
      const updated = await updateUsername(username, documentid);
      alert('Username successfully updated!');
      setUploading(false)
      window.location.reload()
    } catch (error) {
      alert('Failed to update username.');
    }
  }
  };
  const handleDelete = async (postidd :string) => {
    setUploading(true)
    try {
      await deletePost(postidd);
      alert('Post deleted!');
      window.location.reload()
     setUploading(false)
    } catch (error) {
      alert('Failed to delete the post.');
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
      className='lg:w-[100px] lg:h-[90px] h-[45px] w-[45px] rounded-[50%] items-center justify-center'
    />
  ) : <ClipLoader size={25} className='text-primary1' />
) : user?.avatar ? (
  <Image
    width={50}
    height={50}
    src={user.avatar}
    alt='avatar'
    className='lg:w-[50px] lg:h-[50px] rounded-[50%] w-[45px] h-[45px] items-center justify-center text-black'
  />
) : <ClipLoader size={25}  className='text-primary1' />}
            </div>
            <h3 className='font-[600] text-primary2 text-[17px] lg:text-[20px]'>{user?.username}</h3>
          </div>
          
          <Dialog.Root>
          <Dialog.Trigger asChild>
          <button
                className='cursor-pointer font-[600] bg-secondary rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary1'
              >
                Edit profile
              </button>
          </Dialog.Trigger>
            
 <Dialog.Overlay >
     <motion.div
   className="fixed w-screen inset-0 duration-1000 backdrop-blur-md z-50  "
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  />
     </Dialog.Overlay>

     <Dialog.Content className=' border-[1px] border-primary1   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 rounded-2xl gap-[2rem] w-[350px] h-[300px] lg:w-[350px] bg-secondary lg:h-[300px] p-[2rem] flex flex-col items-center justify-center'>
 <Dialog.Title className='hidden'>Settings</Dialog.Title>
{profile === '' ? <>

 <button onClick={()=>setprofile('picture')}
                className='cursor-pointer font-[600] bg-primary1 rounded-2xl lg:py-[1rem] px-[1rem] lg:px-[1.5rem] py-[1rem] text-primary2'
              >
                Change picture
              </button>

 <button onClick={()=> setprofile('username')}
                className='cursor-pointer font-[600] bg-primary1 rounded-2xl lg:py-[1rem] px-[1rem] lg:px-[1.5rem] py-[1rem] text-primary2'
              >
                Change username
              </button>
              </> : ''}
              {
                profile === 'picture' ?
                
                <div className='grid gap-[1rem]  '>
                  <IoIosArrowRoundBack onClick={()=>setprofile('')} className='text-primary1 cursor-pointer ' size={30} />
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className='hidden' />
                {!file ? (
                  <button
                    className='cursor-pointer font-[600] bg-primary1 rounded-2xl px-[1rem] lg:px-[1.5rem] py-[1rem] text-secondary'
                    onClick={handleButtonClick}
                  >
                    Choose picture
                  </button>
                ) : (
                  <button
                    className='cursor-pointer font-[600] bg-primary1 rounded-2xl px-[1rem] lg:px-[1.5rem] py-[1rem] text-secondary'
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ?  <ClipLoader size={25}  className='text-primary1' /> : "Upload Picture"}
                  </button>
                )}
              </div>   
                
                
                :
''              }

{
  profile === 'username' ?
  <div className='flex flex-col gap-[1rem] px-[2rem]'>
     <IoIosArrowRoundBack onClick={()=>setprofile('')} className='text-primary1 cursor-pointer ' size={30} />
     <div>  
  <input
  value={username}
  onChange={(e) => setusername(e.target.value)}
    placeholder='Enter your new username'
    type='text'
    className='text-primary2 focus:ring-0 outline-none border-[1px] px-[1rem] rounded-2xl bg-primary1 h-[65px] w-[300px]'
  />
  </div>  
  <div>  
  <button
                    className='cursor-pointer font-[600] bg-primary1 rounded-2xl px-[1rem] lg:px-[1.5rem] py-[1rem] text-primary2'
                    onClick={handleUsernameUpdate}
                    disabled={uploading}
                  >
                    {uploading ?  <ClipLoader size={25} color='#CDE0FF'  className='text-secondary' /> : "Confirm change"}
                  </button>
</div>
</div>

  :
  ''
}
     </Dialog.Content>
          
          </Dialog.Root>

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
          <div className='flex gap-[0.3rem] items-center'>
  <h3 className='text-primary1 lg:text-[18px] text-[17px] font-[600]' >{post.category}</h3>
   {post.verified === true ?
      <Image
      src={star}
      height={30}
      width={30}
      alt='verified'
      />
    :  
    
    ''}
  </div>
  <div className={`w-[22px] h-[22px] rounded-[50%]  shadow-[0px_4px_8px_rgba(255,0,0,0.7)] ${getColor(post.color)}`}>
      </div>
      </div>
      <div className='flex justify-between items-center'>
      <div className='flex items-center gap-[0.2rem]'>
      <FaLocationDot size={15} className='text-primary1' />
      <h4 className='text-primary1 lg:text-[16px] text-[14px] font-[400]'>{post.location}</h4>
      </div>
      <Dialog.Root>
       
      <Dialog.Trigger>
      <IoTrashBin size={20} className='text-primary1 cursor-pointer' />
      </Dialog.Trigger>
   
      <Dialog.Overlay >
     <motion.div
   className="fixed w-screen inset-0 duration-1000 backdrop-blur-md z-50  "
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  />
     </Dialog.Overlay>

     <Dialog.Content className=' border-[1px] border-primary1   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 rounded-2xl gap-[2rem] w-[350px] h-[300px] lg:w-[350px] bg-secondary lg:h-[300px] p-[1rem] flex flex-col items-center justify-center'>
 <Dialog.Title className='hidden'>Settings</Dialog.Title>
 <div className='flex flex-col gap-[2rem] items-center w-full justify-center'>
 <h3 className='lg:text-[20px] flex items-center justify-center text-[18px] font-[500] w-[100%] text-red-500'>
  THIS ACTION CANT BE UNDONE
 </h3>
 <div>
 <button
                    className='cursor-pointer font-[600] bg-red-600 rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary2'
                    onClick={() => handleDelete(post.$id)}
                    disabled={uploading}
                  >
                    {uploading ?  <ClipLoader size={25} color='#CDE0FF'  className='text-secondary' /> : "Confirm Delete"}
                  </button>
                  
 </div>
 </div>
 </Dialog.Content>
      </Dialog.Root>
      </div>

      <div  className='lg:h-[200px] lg:w-[100%] w-[100%] h-[130px]' style={{
        backgroundImage: `url(${post?.thumbnail[0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
       
      }}>
       
      </div>
      <div className='grid gap-[rem]'>
      <h2 className='text-primary1 lg:text-[25px] text-[18px] font-[600]'>{post.description}</h2>
      <h2 className='text-primary1 lg:text-[16px] text-[14px] font-[400]'>{post.report}</h2>
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
