import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Topbar } from "../components/Topbar"
import { useSelector } from "react-redux"
import { ToastContainer, toast } from 'react-toastify';
import { Comments } from "../components/Comments"

export const Video = () => {
  const [video, setVideo] = useState(null)
  const [ownerId, setOwnerId] = useState(null)
  const [owner, setOwner] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showDescription,setShowDescription] = useState(false)
  const [videos, setvideos] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()
  const [durations, setDurations] = useState({})
  const [showPlaylist, setPlaylist] = useState(false)
  const [userPlaylist, setuserPlaylist] = useState([])
  const api = import.meta.env.VITE_API_URL

    const shortText = (text,limit) => { 
    if(text.length > limit){
      return text.slice(0,limit) + "..."
    }
    return text
   }
const getVideo = async () => {
  const res = await fetch(`${api}/api/video/watch-video/${id}`, {
    credentials: "include",
  })
  const videoRes = await res.json()
  const v = videoRes.data[0]
  setVideo(videoRes.data)
  setOwnerId(v.owner)
  setLikes(v.likes)
  // console.log(videoRes)
  setIsLiked(videoRes.data[0].isLiked)
  // console.log("Like status", videoRes.data[0].isLiked)
}


  const getChannelStats = async () => {
    if (!ownerId) return
    const data = await fetch(`${api}/api/user/${ownerId}`, {
      credentials: "include",
    })
    const channelStats = await data.json()
    setOwner(channelStats.data)
    setSubscribed(channelStats.data.isSubscribed)
  }

  const toggleSubscribe = async () => {
    if (!owner) return

    if (subscribed) {
      await fetch(`${api}/api/unsubscribe/${owner._id}`, {
        method: "DELETE",
        credentials: "include",
      })
      setSubscribed(false)
    } else {
      await fetch(`${api}/api/subscribe/${owner._id}`, {
        method: "GET",
        credentials: "include",
      })
      setSubscribed(true)
    }
  }

  const likeVideo = async () => {
    const res = await fetch(`${api}/api/like/toogle-video-like/${id}`, {
      method: "GET",
      credentials: "include",
    })
    const data = await res.json()
    if (data.success) {
      // console.log(data)
      setIsLiked(data.data.totalLikes > 0)
      setLikes(data.data.totalLikes)
    }
  }
  const allVideos = async () => {
    const res = await fetch(`${api}/api/video/all-videos`, {
      credentials: "include"
    })
    const videos = await res.json()
    // console.log(videos.data)
    // setvideos(videos.data)
     }

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`${api}/api/playlist/get-user-playlist`,{credentials:"include"})
      const data = await res.json()
      const updated = data.data.map((pl) => ({ ...pl, isOptionsVisible: false }))
      setuserPlaylist(updated)
      console.log(updated)
    } catch (error) {
      console.error("Error fetching playlists:", error)
    }
  }
  useEffect(() => {
    fetchPlaylists()
  }, [])

  useEffect(() => {
    getVideo() 
      allVideos();
  }, [id])

  useEffect(() => {
    if (ownerId) {
      getChannelStats()
    }
  }, [ownerId])

  const addToPlaylist = async (playlistId) => {
    const videoId = video[0]._id
    const data = await fetch(`${api}/api/playlist/add/${playlistId}/${videoId}`, { credentials: "include" })
    const res = await data.json()
    if(res.statusCode === 200){
      toast("video added to playlist")
    }else if(res.statusCode === 404){
      toast("video already exists in playlist")
    }else{
      toast("Error adding video to playlist")
    }
    console.log(res)
   }

  return (
    <>

      {/* Add to playlist */}
      <div className={`fixed ${showPlaylist? "visible z-20": "invisible"} shadow-md hover:shadow-lg transition rounded-2xl bg-[#dfdfdf] p-4 flex flex-col gap-3 h-[65%] w-[20%] top-[20%] left-[50%] translate-x-[-50%] overflow-auto`}>
                         <h1 className="text-xl font-semibold text-[#e73434] flex justify-between mb-3">Select Playlist
                         <div className="cursor-pointer" onClick={() => {setPlaylist(false)}}>
                           <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                         </div>

                         </h1>
                          {userPlaylist.map((playlist) => (
                            <div key={playlist._id} className="flex items-center justify-between">
                              <p className="w-[45%] truncate">{playlist.name}</p>
                              <div onClick={() => addToPlaylist(playlist._id)} className="bg-gray-300 hover:bg-gray-400 px-4 py-1 text-gray-600 cursor-pointer rounded-2xl">Add</div>
                            </div>
                          ))}

                        </div>

      {/* Add to playlist ends here */}


      <div className="flex items-center">
        {/* <h1 className="text-[#ff5d5d] font-extrabold text-2xl p-2">MeTube</h1> */}
        <Topbar />
      </div>
      <ToastContainer />

                        



      {video ? (
        video.map((v) => (
          // <>
          <div className="main-container md:grid grid-cols-6 gap-3 mt-5 p-3" key={"284782dnsjdsa2384sjd7823"}>
              <div key={v._id} className="mt-4 p-4 flex flex-col gap-3 col-span-4">
              <div className="flex flex-col gap-3">
                <video
                  src={v.videoFile}
                  controls
                  className="w-full max-h-[70vh] mt-3 rounded-xl"
                />
                <h2 className="text-xl font-bold">{v.title}</h2>
              </div>

              <div className="channel-info">
                {owner && (
                  <>
                  <div className="profile flex items-start gap-4 justify-between flex-wrap">
                    <div className="flex gap-4">
                      <div className="rounded-full">
                        <img
                          src={owner.profilePic}
                          alt=""
                          className="rounded-full w-[36px] h-[36px] cursor-pointer"
                          onClick={() => {navigate(`/profile/${owner._id}`)}}
                        />
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col">
                          <p className="font-bold">{owner.username}</p>
                          <p className="text-slate-500">
                            {owner.subscribersCount} subscribers
                          </p>
                        </div>

                        <button
                          className={`ml-auto text-white px-4 py-2 cursor-pointer hover:bg-red-500 rounded-full border-0 outline-0 ${
                            subscribed ? "bg-gray-600" : "bg-red-400"
                          }`}
                          onClick={toggleSubscribe}
                        >
                          {subscribed ? "Unsubscribe" : "Subscribe"}
                        </button>
                      </div>
                    </div>

                    <div className="like-dislike flex gap-3 items-center flex-wrap">
                      <button
                        className={`bg-gray-300 hover:bg-gray-400 ${
                          isLiked ? "bg-gray-400" : ""
                        } px-4 py-2 rounded-full cursor-pointer flex gap-3`}
                        onClick={likeVideo}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          color="#000000"
                          fill="none"
                        >
                          <path
                            d="M2 12.5C2 11.3954 2.89543 10.5 4 10.5C5.65685 10.5 7 11.8431 7 13.5V17.5C7 19.1569 5.65685 20.5 4 20.5C2.89543 20.5 2 19.6046 2 18.5V12.5Z"
                            stroke="#141B34"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.4787 7.80626L15.2124 8.66634C14.9942 9.37111 14.8851 9.72349 14.969 10.0018C15.0369 10.2269 15.1859 10.421 15.389 10.5487C15.64 10.7065 16.0197 10.7065 16.7791 10.7065H17.1831C19.7532 10.7065 21.0382 10.7065 21.6452 11.4673C21.7145 11.5542 21.7762 11.6467 21.8296 11.7437C22.2965 12.5921 21.7657 13.7351 20.704 16.0211C19.7297 18.1189 19.2425 19.1678 18.338 19.7852C18.2505 19.8449 18.1605 19.9013 18.0683 19.9541C17.116 20.5 15.9362 20.5 13.5764 20.5H13.0646C10.2057 20.5 8.77628 20.5 7.88814 19.6395C7 18.7789 7 17.3939 7 14.6239V13.6503C7 12.1946 7 11.4668 7.25834 10.8006C7.51668 10.1344 8.01135 9.58664 9.00069 8.49112L13.0921 3.96056C13.1947 3.84694 13.246 3.79012 13.2913 3.75075C13.7135 3.38328 14.3652 3.42464 14.7344 3.84235C14.774 3.8871 14.8172 3.94991 14.9036 4.07554C15.0388 4.27205 15.1064 4.37031 15.1654 4.46765C15.6928 5.33913 15.8524 6.37436 15.6108 7.35715C15.5838 7.46692 15.5488 7.5801 15.4787 7.80626Z"
                            stroke="#141B34"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="h-[20px] w-[2px] bg-gray-600"></div>
                        {likes}
                      </button>


                      <button onClick={() => {setPlaylist(true)}} className="w-fit h-fit bg-gray-300 hover:bg-gray-400 cursor-pointer border-0 outline-0 px-3 py-2 rounded-full">
                        Add to playlist
                        


     
                      </button>
                    </div>



                  </div>
                    <div className="flex flex-col gap-2 font-semibold text-gray-500">
                      <p className="">{v.views} {v.views<2 ? "view":"views"}</p>
                      <p>Uploaded on {new Date(v.createdAt).toLocaleDateString()}</p>
                    </div>
                        <div className={`description overflow-hidden mt-3 bg-gray-400 p-2 rounded-2xl shadow-xl`} >
                          <p onClick={()=> setShowDescription(!showDescription)} className="cursor-pointer text-2xl font-semibold text-slate-600">Description</p>
                          <p className={`${showDescription ? "line-clamp-none" : "line-clamp-3"} p-6`}>{v.description}?</p>
                        </div>
                  </>
                )}
              </div>
              </div>

              <div className=" rounded-2xl p-2 col-span-2 max-h-screen overflow-auto md:flex flex-col gap-1 ">
                  {videos.map((video)=>{
              return(
                <div key={video._id} className='flex flex-row gap-2'>

                  <div className="nail cursor-pointer w-[250px] relative" onClick={() => { navigate(`/video/${video._id}`) }}>
                    {video.thumbnail? <img src={video.thumbnail} alt="Video" className='rounded-xl max-w-[350px] h-[150px] object-cover'/> : (
                       <video src={video.videoFile} className='rounded-xl max-w-[350px] max-h-[150px] object-cover'/>
                    )
                  }

                    <div className="absolute bg-black z-10 w-[65px] opacity-[0.7] h-[25px] bottom-0 flex items-center justify-center rounded-[5px] right-2 text-white">{video.duration}</div>
                  </div>

                  <div className="user flex-row items-start gap-3">

                        <div className="flex items-start gap-3">
                          {/* <div className="user-logo rounded-full w-[32px] h-[32px] overflow-hidden bg-slate-600">
                            <img src={video.owner.profilePic} alt="" className='h-full object-cover w-fit'/>
                          </div> */}
                      <h2 className='font-semibold'>{shortText(video.title,50)}</h2></div>

                      <div className="last text-[#a7a7a7] font-semibold">
                        <div>{video.owner.username}</div>

                        <div className="flex flex-col">
                          <div>{video.views} views</div>
                          <div className=''>{new Date(video.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>


                  </div>

                </div>
              )
            })}
              </div>

              <div className="col-span-4 mt-4">
                {/* <h1 className="font-bold text-2xl">All comments</h1> */}
              <Comments videoId={id}/>
              </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-10">Loading...</p>
      )}


      


    </>
  )
}
