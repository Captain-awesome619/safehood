'use client'
import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import useAppwrite from '../lib/useappwrite';
import { getAllPosts } from '../lib/appwrite';
import { uiLocations } from './coordinates';
import Image from 'next/image';
import star from '../../assets/verified.svg'

const LiveFeed1 = () => {
  const uiCenter: [number, number] = [7.4418, 3.9003];
  const { data: posts } = useAppwrite(getAllPosts);
  const [mappedPosts, setMappedPosts] = useState<any[]>([]);
const [data, setData] = useState<any[]>([]);
const [selectedImage, setSelectedImage] = useState<string | null>(null);
const fullscreenRef = useRef<HTMLDivElement | null>(null);
const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const uiBounds = L.latLngBounds(
    [7.4380, 3.8950], // Southwest
    [7.4450, 3.9050]  // Northeast
  );

  useEffect(() => {
    if (!Array.isArray(posts)) return;

    const validMarkers = posts
      .map((post: any) => {
        const location = post?.location || '';
        const normalizedLocation = location.toLowerCase().replace(/\s+/g, '');

        if (uiLocations[normalizedLocation]) {
          return {
            coords: uiLocations[normalizedLocation],
            location: post.location,
            category: post.category,
            color: post.color,
            time : post.$createdAt,
report : post.report,
descripton : post.description,
username : post.creator.username,
thumbnail : post.thumbnail

          };
        }

        return null;
      })
      .filter(Boolean);

    setMappedPosts(validMarkers);
  }, [posts]);

  const getColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'red':
        return 'bg-red-500 shadow-[0_0_10px_4px_rgba(239,68,68,0.6)] text-red-500';
      case 'amber':
        return 'bg-amber-500 shadow-[0_0_10px_4px_rgba(245,158,11,0.6)] text-amber-500';
      case 'pink':
        return 'bg-pink-500 shadow-[0_0_10px_4px_rgba(236,72,153,0.6)] text-pink-500';
      case 'yellow':
        return 'bg-yellow-500 shadow-[0_0_10px_4px_rgba(234,179,8,0.6)] text-yellow-500';
      default:
        return 'bg-gray-500 shadow-[0_0_10px_4px_rgba(107,114,128,0.6)] text-gray-500';
    }
  };

  const createCustomIcon = (color: string) => {
    const colorClass = getColor(color);
    return L.divIcon({
      className: '',
      html: `<div class="lg:w-[20px] lg:h-[20px] w-[18px] h-[18px] rounded-full ${colorClass}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };


  const formatTime = (datetime: string) =>
  new Date(datetime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short', // e.g., Jan, Feb — you can use 'long' for full names
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

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
  

     useEffect(() => {
      if (!openDialogId) {
        setSelectedImage(null);
      }
    }, [openDialogId]);
  return (
    <div className='w-[100%] h-[100%]'>
      <MapContainer
        center={uiCenter}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: '2' }}
        maxBounds={[[7.4300, 3.8900], [7.4500, 3.9150]]}
       
        dragging={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {mappedPosts.map((post, index) => (
          <Marker
            key={index}
            position={post.coords}
            icon={createCustomIcon(post.color)}
          >
        


             <div aria-description='location card' className='border-[1px]  border-primary1 w-max   p-[1rem]     bg-secondary  rounded-3xl ' >
                        <Popup className='bg-secondary flex items-center justify-center p-[1rem]'>
              <div className='flex flex-col items-center justify-center gap-[1rem]'>  

<div className='flex flex-col gap-[1rem] border-b-2 border-primary1 pb-[1rem]'>
 <div className="flex flex-col gap-2">

  {/* Top two images side by side with dividing line */}
  <div className="flex w-full  flex-col gap-[1rem]">
  {/* Top two images */}
  <div className="flex flex-row w-full gap-[1rem]">
    {/* First image */}
    {post.thumbnail[0] && (
      <div
       onClick={() => setSelectedImage(post.thumbnail[0])}
        className="flex-1 w-[100px] h-[150px] rounded-2xl bg-cover bg-center"
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
        className=" w-[100%] flex-1 h-[150px] rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${post.thumbnail[1]})` }}
      />
    )}
  </div>

  {/* Bottom image spanning full width */}
  {post.thumbnail[2] && (
    <div className=' flex items-center justify-center'>
    <div
     onClick={() => setSelectedImage(post.thumbnail[2])}
      className=" w-[200px] lg:w-[200px] h-[150px]  rounded-2xl bg-cover bg-center"
      style={{ backgroundImage: `url(${post.thumbnail[2]})` }}
    />
    </div>
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
 

           <div className=' bg-primary1 border-b- border-primary1 flex-col gap-[1.5rem] p-[1rem] rounded-3xl lg:w-[300px] w-[250px]'>
          <div className='flex flex-row justify-between items-center '>
          <h3 className='font-[500] text-secondary lg:text-[15px] text-[14px]'>Author-{post?.username}</h3>
          <h3 className='font-[500] text-secondary lg:text-[15px] text-[14px]'>{formatTime(post?.time)}</h3>
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
  <div className="flex ml-auto">
                        <button
                          className="text-primary2 font-[600] text-[14px] lg:text-[17px] px-[1rem] py-[0.5rem]  border border-primary1 rounded-2xl bg-primary1"
                          onClick={handleShare}
                        >
                          Share
                        </button>
                      </div>
</div> 
                     </Popup>   
                  </div>




           
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveFeed1;
