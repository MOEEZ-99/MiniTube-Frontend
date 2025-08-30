import React, { use, useEffect, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Topbar } from '../components/Topbar'

export const Home = () => {
  const navigate = useNavigate()
  const [videos, setvideos] = useState([])
  const [showCat, setshowCat] = useState(0)
  const [loading, setLoading] = useState(true)
  const url = import.meta.env.VITE_API_URL

  const shortText = (text,limit) => { 
    if(text.length > limit){
      return text.slice(0,limit) + "..."
    }
    return text
   }

  const allVideos = async () => { 
    setLoading(true)
    const res = await fetch(`${url}/api/video/all-videos`,{
      credentials:"include"
    })
    const videos = await res.json()
    setvideos(videos.data)
    setLoading(false)
   }

   useEffect(()=>{
    allVideos();
   },[])

   const VideoSkeleton = () => {
     return (
       <div className="flex flex-col gap-4 animate-pulse">
         <div className="w-full h-56 md:h-64 lg:h-72 bg-neutral-800 rounded-xl"></div>
         <div className="flex items-start gap-4">
           <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-800 rounded-full"></div>
           <div className="flex-1 space-y-2">
             <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
             <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
             <div className="h-3 bg-neutral-800 rounded w-1/4"></div>
           </div>
         </div>
       </div>
     )
   }

  return (
    <>
    <div className='flex gap-0 w-full'>
      <Topbar />
    </div>

      <hr className='w-full text-black mt-4'/>
       <div className='flex items-center mt-3 max-w-screen overflow-x-auto gap-2'>
           {
          ["All","Music","Electronic Warfare","American Holocaust","Red Cloud Fighter",,"Cloud Computing"].map((c,i)=>{
            return(
              <div key={i} className={`cursor-pointer px-2 py-2 rounded-3xl whitespace-nowrap ${showCat === i ? "bg-[#ff5d5d] text-white" : ""}`} onClick={()=>{setshowCat(i)}}>
                {c}
              </div>
            )
          })
        }
       </div>

      <hr className='w-full text-black mt-4'/>
        <div className='mt-8'>
          <div className="grid gap-4 md:grid-cols-3 2xl:grid-cols-4 grid-cols-1">
   {loading 
    ? Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={i} />)
    : videos.map((v) => {
  return (
    <div key={v._id} className="flex flex-col gap-4">
      <div
        className="relative cursor-pointer rounded-xl overflow-hidden shadow-sm transition-transform transform hover:scale-[1.02]"
        onClick={() => { navigate(`/video/${v._id}`) }}
      >
        <img
          src={v.thumbnail? v.thumbnail:"https://placehold.co/600x400?text=No+Thumbnail"}
          alt={shortText(v.title, 60)}
          className="w-full h-56 md:h-64 lg:h-42 object-cover rounded-xl"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
        <div className="absolute bottom-3 right-3 bg-black/90 text-slate-400 text-xs md:text-sm font-medium px-2.5 py-1 rounded-md shadow-sm">
          {Math.floor(v.duration)}
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div 
        onClick={() => {navigate(`/profile/${v.owner._id}`)}}
        className="cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 bg-neutral-700/40 border border-neutral-700">
          <img
            src={v.owner.profilePic}
            alt={v.owner?.username || v.owner?.fullName || 'channel'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-base md:text-lg font-semibold text-slate-500 leading-tight mb-1 line-clamp-2"
            title={v.title}
          >
            {shortText(v.title, 60)}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <div className="text-sm text-slate-500 font-medium truncate">
             {v.owner.username}
            </div>
            <div className="flex items-center gap-3 text-xs md:text-sm text-slate-400 mt-1 sm:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"></path>
                <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
              </svg>
              <span>{v.views?.toLocaleString()} views</span>
              <span className="text-slate-600">•</span>
              <time className="whitespace-nowrap">{new Date(v.createdAt).toDateString()}</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})}
          </div>
        </div>
    </>
  )
}
