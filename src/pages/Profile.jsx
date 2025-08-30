import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const Profile = () => {
  const url = import.meta.env.VITE_API_URL
  const [userVideos, setuserVideos] = useState(null)
  const [channel, setchannel] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const getUserVideos = async () => {
    const data = await fetch(`${url}/api/channel/videos/${id}`, { credentials: 'include' })
    const res = await data.json()
    setuserVideos(res)
    console.log(res)
  }

  const channelProfile = async () => {
    const data = await fetch(`${url}/api/channel/stats/${id}`, { credentials: 'include' })
    const res = await data.json()
    setchannel(res)
    console.log(res)
  }

  useEffect(() => {
    getUserVideos()
    channelProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Cover */}
      <div className="w-full h-46 bg-gray-200 relative">
        <img
          src={channel?.user?.coverImage || "https://via.placeholder.com/1200x300?text=Cover"}
          alt="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Profile header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 -mt-10 z-[200]">
                <img
                  src={channel?.user?.profilePic || 'https://via.placeholder.com/150'}
                  alt="profile"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow z-30"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold leading-tight">
                  {channel?.user?.fullName || 'Unknown'}
                </h2>
                <p className="text-sm text-gray-500">@{channel?.user?.username || 'username'}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">{channel?.subscribers ?? 0}</span>
                  <span className="ml-2">subscribers</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-20">
              <button
              onClick={async () =>{
                if(channel.isSubscribed){
                  const data = await fetch(`${url}/api/unsubscribe/${channel.user?._id}`, {
                    method: "DELETE",
                    credentials: "include"
                  })
                  const res = await data.json()
                  console.log(res)
                  channelProfile()
                } else{
                  const data = await fetch(`${url}/api/subscribe/${channel.user?._id}`, {
                    method: "GET",
                    credentials: "include"
                  })
                  const res = await data.json()
                  console.log(res)
                  channelProfile()
                }
              }}
                type="button"
                className={`cursor-pointer hover:bg-red-600 px-4 py-2 rounded-md font-medium border focus:outline-none transition-all shadow-sm
                  ${channel?.isSubscribed ? 'bg-white text-gray-700 border-gray-300' : 'bg-red-600 text-white border-transparent'}`}
                aria-pressed={channel?.isSubscribed ? 'true' : 'false'}
              >
                {channel?.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Videos</h3>

          {Array.isArray(userVideos) && userVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userVideos.map((video) => (
                <article onClick={() => {navigate(`/video/${video._id}`)}} key={video._id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="relative cursor-pointer">
                    <img
                      src={video.thumbnail || 'https://via.placeholder.com/480x270'}
                      alt={video.title}
                      className="w-full h-44 object-cover"
                    />
                    {video.duration != null && (
                      <span className="absolute right-2 bottom-2 text-xs bg-black/70 text-white rounded px-1.5 py-0.5">
                        {Math.floor(video.duration)}s
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={video.owner?.profilePic || channel?.user?.profilePic || 'https://via.placeholder.com/48'}
                        alt={video.owner?.fullName || 'owner'}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />

                      <div className="flex-1">
                        <h4 className="text-sm font-medium truncate" title={video.title}>
                          {video.title || 'Untitled video'}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {video.owner?.fullName || channel?.user?.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-sm text-center text-gray-500">No videos found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
