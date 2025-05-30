import React, { useState, useEffect,useRef } from 'react';
import useAppwrite from '../lib/useappwrite';
import { getAllPosts, storage, appwriteConfig } from '../lib/appwrite';
import Image from 'next/image';
import { Dialog } from 'radix-ui';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import star from '../../assets/verified.svg';

const Feed = () => {
  const { data: posts } = useAppwrite(getAllPosts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
 const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pictureUrls, setPictureUrls] = useState<Record<string, string>>({});
const [selectedImage, setSelectedImage] = useState<string | null>(null);
const fullscreenRef = useRef<HTMLDivElement | null>(null);
const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const getCreatorPicture = async (pictureId: string, postId: string) => {
    try {
      const file = await storage.getFileView(appwriteConfig.storageId, pictureId);
      setPictureUrls(prev => ({
        ...prev,
        [postId]: file.href,
      }));
      return file.href;
    } catch (error) {
      console.error("Error fetching creator picture", error);
      return "";
    }
  };

  useEffect(() => {
    if (posts) {
      setIsLoading(true);
      const fetchPicturesAndUpdatePosts = async () => {
        const updated = await Promise.all(posts.map(async (post: any) => {
          const pictureUrl = await getCreatorPicture(post.creator.picture, post.$id);

          const ava =post.creator.avatar
          console.log(ava)
          return {
            ...post,
            creator: {
              ...post.creator,
              pictureUrl,
              ava
            },
          };
        }));
        setData(updated);
      };
      fetchPicturesAndUpdatePosts().finally(() => setIsLoading(false));
    }
  }, [posts]);

const formatTime = (datetime: string) =>
  new Date(datetime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short', // e.g., Jan, Feb — you can use 'long' for full names
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const getColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'red': return 'bg-red-500 shadow-[0_0_10px_4px_rgba(239,68,68,0.6)] text-red-500';
      case 'amber': return 'bg-amber-500 shadow-[0_0_10px_4px_rgba(245,158,11,0.6)] text-amber-500';
      case 'pink': return 'bg-pink-500 shadow-[0_0_10px_4px_rgba(236,72,153,0.6)] text-pink-500';
      case 'yellow': return 'bg-yellow-500 shadow-[0_0_10px_4px_rgba(234,179,8,0.6)] text-yellow-500';
      default: return 'bg-gray-500 shadow-[0_0_10px_4px_rgba(107,114,128,0.6)] text-gray-500';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Page Title',
          text: 'Check out this page!',
          url: window.location.href,
        });
        console.log('Page shared successfully');
      } catch (error) {
        console.error('Error sharing the page', error);
      }
    } else {
      alert('Sharing not supported on this browser');
    }
  };

  useEffect(() => {
  if (!openDialogId) {
    setSelectedImage(null);
  }
}, [openDialogId]);
  return (
    <div className="grid gap-[2rem]" >
      <h2 className="text-[35px] font-[600] text-primary1">Live Reports Feed</h2>

      {isLoading ? (
        <ClipLoader size={50} />
      ) : (
        <>
          {data.length > 0 ? (
            <div className="grid gap-[1rem]">
              {data.map((post: any, index: number) => (
                <Dialog.Root  key={post.$id || index}
  open={openDialogId === post.$id}
  onOpenChange={(open) => setOpenDialogId(open ? post.$id : null)}>
                  <Dialog.Trigger asChild>
                    <div className="cursor-pointer lg:w-[700px] grid gap-[1rem] px-[1.5rem] lg:px-[3rem] py-[2rem] bg-primary1 rounded-3xl">
                      <h3 className="text-secondary lg:text-[18px] text-[17px] font-[400]">{post.category}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-[0.5rem]">
                         
                         <Image
  src={
    post.creator.picture ?
       post.creator.pictureUrl
      : post.creator.avatar
  }
  width={100}
  height={55}
  className="rounded-[50%] lg:w-[60px] w-[50px] lg:h-[60px] h-[50px]"
  alt="avatar"
/>

                          <div className="grid">
                            <h3 className="text-secondary lg:text-[18px] text-[16px] font-[400]">Author - {post?.creator?.username}</h3>
                            <h3 className="text-secondary lg:text-[18px] text-[16px] font-[400] pr-[0.5rem] lg:pr-0">Time - {formatTime(post?.$createdAt)}</h3>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-[0.6rem]">
                          {post.verified && <Image src={star} height={40} width={40} alt="verified" />}
                          <div className={`w-[22px] h-[22px] rounded-[50%] ${getColor(post.color)}`} />
                        </div>
                      </div>
                      <div className="bg-secondary rounded-3xl grid gap-[0.2rem] w-[100%] pt-[1rem] lg:pb-[2rem] pb-[2rem] px-[1.5rem] lg:px-[2rem]">
                        <h3 className="text-primary1 lg:text-[25px] text-[18px] font-[600]">{post.description}</h3>
                        <h3 className="text-primary1 lg:text-[16px] text-[14px] font-[400]">{post.report}</h3>
                      </div>
                    </div>
                  </Dialog.Trigger>

                  <Dialog.Overlay>
                    <motion.div
                      className="fixed inset-0 z-[50] backdrop-blur-md"
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
                    <Dialog.Content
                      className="z-[60] border  border-primary1 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-3xl p-[1rem] flex flex-col items-center justify-center gap-[1rem]"
                    >
                      <Dialog.Title className="hidden">Settings</Dialog.Title>

                      <div className="flex flex-col gap-[1rem] pb-[1rem] border-b border-primary1 w-full items-center">
                        <div className="flex flex-col gap-2">

  {/* Top two images side by side with dividing line */}
  <div className="flex w-full  flex-col gap-[0.5rem] lg:gap-[1rem]">
  {/* Top two images */}
  <div className="flex flex-row w-full gap-[0.5rem] lg:gap-[1rem]">
    {/* First image */}
    {post.thumbnail[0] && (
      <div
       onClick={() => setSelectedImage(post.thumbnail[0])}
        className="flex-1 w-[350px] h-[170px] lg:h-[200px] rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${post.thumbnail[0]})` }}
      />
    )}

    {/* Divider line */}
    {post.thumbnail[1] && (
    <div className="hidden sm:block w-[2px] bg-primary1 rounded-xl" />
    )}
    {/* Second image */}
    {post.thumbnail[1] && (
      <div
       onClick={() => setSelectedImage(post.thumbnail[1])}
        className=" w-[100%] flex-1 h-[170px] lg:h-[200px] rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${post.thumbnail[1]})` }}
      />
    )}
  </div>

  {/* Bottom image spanning full width */}
  {post.thumbnail[2] && (
    <div
     onClick={() => setSelectedImage(post.thumbnail[2])}
      className=" w-[350px] lg:w-[400px] h-[150px] rounded-2xl bg-cover bg-center"
      style={{ backgroundImage: `url(${post.thumbnail[2]})` }}
    />
  )}
</div>



 {selectedImage && (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={() => setSelectedImage(null)}
      ref={fullscreenRef}
    >
      <img
        src={selectedImage}
        alt="Fullscreen"
        className="max-w-full max-h-full rounded-xl"
      />
      <button
        className="absolute top-4 right-4 text-white text-3xl font-bold"
        onClick={() => setSelectedImage(null)}
      >
        &times;
      </button>
    </div>
  )}
 <div className='flex justify-between '>
 <div className="flex gap-[0.5rem]">
                            <div className={`w-[22px] h-[22px] rounded-full ${getColor(post.color)}`} />
                            <h3 className="text-primary1 lg:text-[18px] text-[15px] font-[500]">{post.category}</h3>
                          </div>
                          
                          <h3 className="text-primary1 lg:text-[18px] text-[15px] font-[500]">{post.location}</h3>
                        </div>
</div>
 

 
                        <div className="bg-primary1 p-[1rem] rounded-3xl lg:w-[400px] w-[350px]">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-[500] text-secondary lg:text-[17px] text-[14px]">Author - {post?.creator?.username}</h3>
                            <h3 className="font-[500] text-secondary lg:text-[17px] text-[14px]">{formatTime(post?.$createdAt)}</h3>
                          </div>
                          <div className="flex items-center gap-[0.5rem]">
                            <h2 className="font-[600] text-secondary lg:text-[20px] text-[16px]">{post.description}</h2>
                            {post.verified && <Image src={star} height={20} width={20} alt="verified" />}
                          </div>
                          <h4 className="font-[400] text-secondary lg:text-[17px] text-[14px]">{post.report}</h4>
                        </div>
                      </div>
                      <div className="flex ml-auto">
                        <button
                          className="text-primary2 font-[600] text-[17px] p-[1rem] border border-primary1 rounded-2xl bg-primary1"
                          onClick={handleShare}
                        >
                          Share
                        </button>
                      </div>
                    </Dialog.Content>
                  </motion.div>
                </Dialog.Root>
              ))}
            </div>
          ) : (
            <h2 className="flex items-center justify-center text-primary1 lg:text-[25px] text-[18px] font-[600]">
              There are no posts available
            </h2>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
