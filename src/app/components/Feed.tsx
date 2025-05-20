import React from 'react'
import { useState, useEffect } from 'react'
import useAppwrite from '../lib/useappwrite'
import { getAllPosts } from '../lib/appwrite'
import Image from 'next/image'
import { Dialog } from 'radix-ui'
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners'
import { storage } from '../lib/appwrite'
import { appwriteConfig } from '../lib/appwrite'
import star from '../../assets/verified.svg'
const Feed = () => {
  const { data: posts} = useAppwrite(getAllPosts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [pictures, setPictures] = useState<any>() // Store pictures here by creator ID

   useEffect(() => {
    if (posts) {
      setIsLoading(true);
      const fetchCreatorPictures = async () => {
        const updatedPosts = await Promise.all(
          posts.map(async (post:any) => {
            const pictureUrl = await getCreatorPicture(post.creator.picture);
            
            // assuming creator has pictureId
            return {
              ...post,
              creator: {
                ...post.creator,
                pictureUrl, // Add the picture URL to the creator object
              },
            };
          })
        );
        setData(updatedPosts);
      };

      fetchCreatorPictures().finally(() => setIsLoading(false));
    }
  }, [posts]);
  const getCreatorPicture = async (pictureId: string) => {
    try {
      // Replace this with actual API call to Appwrite to fetch the picture
       const file = await storage.getFileView(appwriteConfig.storageId, pictureId);
       setPictures(file.href)
            return file.href
    } catch (error) {
      console.error("Error fetching creator picture", error)
      return ""
    }
  }
   const formatTime = (datetime :string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
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
    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Page Title',
            text: 'Check out this page!',
            url: window.location.href,  // or specify a specific URL
          });
          console.log('Page shared successfully');
        } catch (error) {
          console.error('Error sharing the page', error);
        }
      } else {
        alert('Sharing not supported on this browser');
      }
    };
  
   
  return (
    <div className='grid gap-[2rem]'>  
   <h2 className='text-[35px] font-[600] text-primary1 '>Live Reports Feed</h2>
   {isLoading == true?
<ClipLoader size={50} />
:
   <>
   {data? <div className='grid gap-[1rem]'>
      {data?.map((post:any, index:number) => (
<Dialog.Root   key={post.$id || index} >
   <Dialog.Trigger asChild>
 <div className='cursor-pointer lg:w-[700px] grid gap-[1rem] h-max px-[1.5rem] lg:px-[3rem] py-[2rem] bg-primary1 rounded-3xl'> 
<h3 className='text-secondary lg:text-[18px] text-[17px] font-[400]'>{post.category}</h3>

<div className='flex items-center justify-between'>

<div className='flex gap-[0.5rem]'>

{
  post?.creator?
  <Image 
  src={pictures}
  width={100}
  height={55}
  className='rounded-[50%] lg:w-[60px] w-[50px] lg:h-[60px] h-[50px]'
  alt='avatar'
  />
  :
  <Image 
  src={post?.creator?.avatar}
  width={50}
  height={35}
  className='rounded-[50%] lg:w-[60px] w-[50px] lg:h-[60px] h-[50px]'
  alt='avatar '
  />
}
<div className='grid'>
<h3 className='text-secondary lg:text-[18px] text-[16px] font-[400]'>Author - {post?.creator?.username}</h3>
<h3 className='text-secondary text-wrap lg:text-[18px] text-[16px] font-[400] pr-[0.5rem] lg:pr-0'>Time - {formatTime(post?.$createdAt)}</h3>
</div>
</div>
<div className='flex items-center justify-center gap-[0.6rem]'>
   {post.verified === true ?
      <Image
      src={star}
      height={40}
      width={40}
      alt='verified'
      />
    :  
    ''}
<div className={`w-[22px] h-[22px] rounded-[50%]   ${getColor(post.color)}`}>
      </div>
</div>
</div>
<div className='bg-secondary rounded-3xl grid gap-[0.2rem] w-[100%] h-max pt-[1rem] lg:pb-[2rem] pb-[2rem] px-[1.5rem] lg:px-[2rem]'>
<h3 className='text-primary1 lg:text-[25px] text-[18px] font-[600]'>{post.description}</h3>
<h3  className='text-primary1 lg:text-[16px] text-[14px] font-[400]'>{post.report}</h3>
</div>
 </div>
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
     
     <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
     >   
     <Dialog.Content aria-description='modal' className='border-[1px] border-primary1 z-60 w-max  p-[1rem] gap-[1rem]  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  flex flex-col items-center justify-center bg-secondary  rounded-3xl ' >
          <Dialog.Title className='hidden'>Settings</Dialog.Title>
          <div className='flex flex-col gap-[1rem] pb-[1rem]  border-b-[1px] border-primary1 items-center justify-center w-full'>
          <div className='rounded-3xl w-[350px] h-[200px] py-[0.5rem] lg:w-[400px] flex justify-between items-end px-[1rem]' 
           style={{
            backgroundImage: `url(${post.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          >
  <div className='flex gap-[0.5rem]'>
  <div className={`w-[22px] h-[22px] rounded-[50%]   ${getColor(post.color)}`}>
  </div>
  <h3 className='text-primary2 lg:text-[18px] text-[15px] font-[500]'>{post.category}</h3>
  </div>
  <h3 className='text-primary2 lg:text-[18px] text-[15px] font-[500]'>{post.location}</h3>
          </div>
          <div className=' bg-primary1 flex-col gap-[1.5rem] p-[1rem] rounded-3xl lg:w-[400px] w-[350px]'>
          <div className='flex flex-row justify-between items-center '>
          <h3 className='font-[500] text-secondary lg:text-[17px] text-[14px]'>Author-{post?.creator?.username}</h3>
          <h3 className='font-[500] text-secondary lg:text-[17px] text-[14px]'>{formatTime(post?.$createdAt)}</h3>
          </div>
 <div className='flex items-center gap-[0.5rem]'>
          <h2 className='font-[600] text-secondary lg:text-[20px] text-[16px]'>{post.description}</h2>
            {post.verified === true ?
      <Image
      src={star}
      height={20}
      width={20}
      alt='verified'
      />
    :  
    ''}
</div>
          <h4 className='font-[400] text-secondary lg:text-[17px] text-[14px]'>{post.report}</h4>
          </div>
          
          </div>
          <div className='flex ml-auto'>
          <button className='text-primary2 font-[600] text-[17px] p-[1rem] border-primary1 rounded-2xl flex items-center justify-center bg-primary1   cursor-pointer'
          onClick={handleShare}
          >Share</button>
          </div>
     </Dialog.Content>
</motion.div>
 </Dialog.Root>
      ))}
    </div>
    : 
    <h2 className='flex items-center justify-center text-primary1 lg:text-[25px] text-[18px] font-[600]'  >There are no posts available</h2>
   }
   </>
}
      </div>
  )
}
export default Feed