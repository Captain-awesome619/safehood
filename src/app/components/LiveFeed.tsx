'use client'
import React from 'react'
import dynamic from 'next/dynamic';


const ClientMap = dynamic(() => import('@/app/components/pages'), {
  ssr: false, // disable server-side rendering to prevent window errors
});
const LiveFeed = () => {
  return (
    <div className=" w-[100%] h-[100%]">
 <ClientMap />
   </div>

  )
}

export default LiveFeed
