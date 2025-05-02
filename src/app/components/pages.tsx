'use client'
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import useAppwrite from '../lib/useappwrite';
import { getAllPosts } from '../lib/appwrite';
import { data } from 'framer-motion/client';
import { uiLocations } from './coordinates';
import { motion } from 'framer-motion';
const LiveFeed1 = () => {



      

  const uiCenter: [number, number] = [7.4418, 3.9003];
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mappedPosts, setMappedPosts] = useState<any>('');

  // Optional: restrict the map to the UI campus only
  const uiBounds = L.latLngBounds(
    [7.4380, 3.8950], // Southwest
    [7.4450, 3.9050]  // Northeast
  );

  useEffect(() => {
    if (!Array.isArray(posts)) return;
  
    const validMarkers = posts
      .map((post:any) => {
        const location = post?.location || '';
        const normalizedLocation = location.toLowerCase().replace(/\s+/g, '');
  
        if (uiLocations[normalizedLocation]) {
          return {
            coords: uiLocations[normalizedLocation],
          };
        }
  
        return null;
      })
      .filter(Boolean); // removes null entries
  
    setMappedPosts(validMarkers); // Set array of valid posts with coords
  }, [posts]);
  

  const getColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'red':
        return 'bg-red-500 shadow-[0_0_10px_4px_rgba(239,68,68,0.6)] text-red-500'; // red-500
      case 'amber':
        return 'bg-amber-500 shadow-[0_0_10px_4px_rgba(245,158,11,0.6)] text-amber-500'; // amber-500
      case 'pink':
        return 'bg-pink-500 shadow-[0_0_10px_4px_rgba(236,72,153,0.6)] text-pink-500'; // pink-500
      case 'yellow':
        return 'bg-yellow-500 shadow-[0_0_10px_4px_rgba(234,179,8,0.6)] text-yellow-500'; // yellow-500
      default:
        return 'bg-gray-500 shadow-[0_0_10px_4px_rgba(107,114,128,0.6)] text-gray-500'; // gray-500
    }
  };
 
const createCustomIcon = (category: string) => {
    const colorClass = getColor(category);
  
    return L.divIcon({
      className: '', // clear default
      html: `<div class="lg:w-[20px]  lg:h-[20px] w-[18px] h-[18px] rounded-full ${colorClass}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10], // center point of the icon
    });
  };
  const facultyOfScience: [number, number] = [7.4425, 3.8998];  

  return (
    <div className='  w-[100%] h-[90%]'>
      <MapContainer
        center={uiCenter}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: '2' }}
        maxBounds={[[7.4300, 3.8900], [7.4500, 3.9150]]} 
        maxBoundsViscosity={1.0}
        dragging
        
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker for Faculty of Science inside UI */}
{posts?.map((con:any, index:any)=>(
      <div key={index}>
     {Array.isArray(mappedPosts) &&
  mappedPosts.map((post:any, index:any) => (
    <Marker
      key={index}
      position={post.coords}
      icon={createCustomIcon(con.color)}
    >
       <Popup>
    <motion.div
      className="p-2 flex gap-[0.5rem]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className='font-[500]  text-sm text-primary1'> {con?.location} </h4>
      -
      <h4 className={`font-[500] text-sm  text-${(con?.color)}-500`}> {con?.category}</h4>
     
    </motion.div>
  </Popup>
    </Marker>
))}
</div>
))}
      </MapContainer>
      

    </div>
  )
}

export default LiveFeed1
