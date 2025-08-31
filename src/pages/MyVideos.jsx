import React, { useEffect, useState } from 'react'
import { Topbar } from '../components/Topbar'
import { useNavigate } from 'react-router-dom'

export const MyVideos = () => {
  const url = import.meta.env.VITE_API_URL
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  // const [options, setoptions] = useState(false)
  const navigate = useNavigate()
  const userVideos = async () => { 
    const data = await fetch(`${url}/api/video/user-videos`, {
      credentials: "include"
    })
    const res = await data.json()
    // setVideos(res.data)
    setLoading(false)
    setVideos(res.data.map((v) => {
      return {
        ...v,
        isEditing: false,
      }
    }))
    console.log(res)
  }
  const shortText = (text,limit) => { 
    if(text.length > limit){
      return text.slice(0,limit) + "..."
    }
    return text
   }

   const setOptions = (videoId) => { 
     setVideos(videos.map((v) => {
       if(v._id === videoId) {
         return {
           ...v,
           isEditing: !v.isEditing,
         }
       }
       return v
     }))
   }
   const deleteVideo = async (videoId) => { 
    const yes = confirm("Are you sure you want to delete this video?")
     if(yes){
       const data = await fetch(`${url}/api/video/delete-video/${videoId}`, {
        method: "DELETE",
        credentials: "include",
      })
      const res = await data.json()
      userVideos()
      console.log(res)
     }
  }
  useEffect(() => {
    userVideos()
  }, [])
  if(loading) return <div>Loading...</div>
  return (
    <>
      <Topbar />

      <div className="controls flex justify-between p-3">
        <h2 className='text-3xl font-semibold'>My Videos</h2>
       <button onClick={() => {navigate("/upload-video")}} className="px-5 py-2 cursor-pointer w-fit rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all">Create a new video</button>

      </div>


      <div className="all-videos">
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
          {videos.length === 0? <h1 className='text-xl p-4'>No videos found</h1> : videos.map((v)=>{
            return(
              <div key={v._id} className='flex flex-col gap-3'>

                <div className="nail cursor-pointer rounded-xl overflow-hidden relative group" onClick={() => { navigate(`/video/${v._id}`) }}>
                  <img src={v.thumbnail} alt="Video" className='w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300'/>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                    {Math.floor(v.duration)}s
                  </span>
                </div>

                <div className="user flex flex-col items-start gap-2">
                  <div className="flex items-start gap-3">
                    <div className="user-logo w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img src={v.owner[0].profilePic} alt="" className='h-full w-full object-cover'/>
                    </div>

                    <div className="flex flex-col flex-1">
                      <h2 className='font-semibold text-sm line-clamp-2'>{shortText(v.title,60)}</h2>
                      <div className="text-[#949494] text-xs">{v.owner.username}</div>
                      <div className="flex gap-4 text-xs text-[#949494] mt-1">
                        <div>{v.views} views</div>
                        <div>{new Date(v.createdAt).toDateString()}</div>
                      </div>
                    </div>

                    <div className='relative'>
                      <div className="svg cursor-pointer" onClick={() => { setOptions(v._id) }}> 
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="5" cy="12" r="2"/>
                          <circle cx="12" cy="12" r="2"/>
                          <circle cx="19" cy="12" r="2"/>
                        </svg>
                      </div>

                      {v.isEditing && (
                        <div className="absolute top-full right-0 bg-white shadow-md rounded-md mt-2 z-10">
                          <ul className="flex flex-col text-sm">
                            {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li> */}
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {deleteVideo(v._id)}}>Delete</li>
                          </ul>
                        </div>
                      )}
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
