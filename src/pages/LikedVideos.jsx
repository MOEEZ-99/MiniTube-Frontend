import React, { useEffect, useState } from 'react'
import {
  Play,
  Eye,
  Clock,
  MoreHorizontal,
  // ThumbDown,
  User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Topbar } from '../components/Topbar'

export const LikedVideos = () => {
  const url = import.meta.env.VITE_API_URL
  const [likedVideos, setLikedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchLikedVuideos = async (first) => {
    try {
      const data = await fetch(`${url}/api/like/get-liked-videos`, {
        credentials: 'include'
      })
      const res = await data.json()
      console.log(res)

      setLikedVideos(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
    } catch (err) {
      console.error('Failed to fetch liked videos', err)
      setLikedVideos([])
    } finally {
      setLoading(false)
    }
  }
  const dislike = async (videoId) => { 
    const data = await fetch(`${url}/api/like/toogle-video-like/${videoId}`, {credentials:"include"})
    const res = await data.json()
    console.log(res)
    fetchLikedVuideos()
   }

  useEffect(() => {
    fetchLikedVuideos()
  }, [])

  const getOwner = (video) => {
    if (!video) return null
    if (video.owner && typeof video.owner === 'object') return video.owner
    if (video.ownerDetails && typeof video.ownerDetails === 'object') return video.ownerDetails
    if (Array.isArray(video.ownerDetails) && video.ownerDetails[0]) return video.ownerDetails[0]
    return null
  }

  const formatViews = (n) => {
    // if (n == null) return ''
    // if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    // if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n
  }

  const formatDate = (d) => {
    if (!d) return ''
    try {
      const dt = new Date(d)
      return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return d
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-600">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%);
          background-size: 800px 100%;
          animation: shimmer 1.2s infinite linear;
        }
      `}</style>

        <Topbar/>
      <div className="max-w-[1400px] mx-auto p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Liked Videos</h1>
            <p className="text-sm text-slate-400 mt-1">All videos you liked.</p>
          </div>
          {/* <div className="text-sm text-slate-400">{loading ? 'Loading...' : `${likedVideos.length} items`}</div> */}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden p-3 bg-neutral-800/40">
                  <div className="skeleton rounded-lg h-44 md:h-40 mb-4" />
                  <div className="flex items-center gap-3">
                    <div className="skeleton rounded-full h-11 w-11 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="skeleton h-4 rounded w-3/4 mb-2" />
                      <div className="skeleton h-3 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && likedVideos.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400">
              No liked videos yet.
            </div>
          )}

          {!loading &&
            likedVideos.map((like) => {
              const video = like.video
              if (!video) {
                return (
                  <></>
                  // <div key={like._id} className="rounded-xl bg-neutral-800 p-3 flex flex-col gap-3">
                  //   <div className="h-40 rounded-md bg-gradient-to-r from-red-700 to-pink-600 flex items-center justify-center">
                  //     <div className="text-center text-white/90">
                  //       <p className="font-bold">Video unavailable</p>
                  //       <p className="text-xs text-white/80">This video was removed or is private</p>
                  //     </div>
                  //   </div>
                  //   <div className="flex items-center justify-between">
                  //     <div className="text-sm text-slate-300">—</div>
                  //     <div>
                  //       <button className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-700/50 text-sm text-slate-200">
                  //    Dislike
                  //       </button>
                  //     </div>
                  //   </div>
                  // </div>
                )
              }

              const owner = getOwner(video)
              const thumb = video.coverImage || video.thumbnail || (video.videoFile ? `${video.videoFile}` : '')
              const title = video.title || video.description || 'Untitled'
              const channelName = owner?.username
              const profilePic = owner?.profilePic || owner?.avatar || null
              const views = video.views || video.totalViews
              const createdAt = video.createdAt || like.createdAt

              return (
                <article key={like._id} className="rounded-2xl bg-gradient-to-b from-neutral-100 to-neutral-200 p-3 shadow-lg transform hover:-translate-y-1 transition">
                  {/* thumbnail */}
                  <div onClick={()=>{navigate(`/video/${video._id}`)}} className="relative rounded-lg overflow-hidden mb-3">
                    <img
                      src={thumb || 'https://via.placeholder.com/640x360?text=No+Thumbnail'}
                      alt={title}
                      className="w-full h-44 object-cover md:h-40 lg:h-44"
                    />

                    <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-white/90 flex items-center gap-2">
                      <Play size={14} />
                      <span>{Math.floor(video.duration)}</span>
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                      <button className="bg-black/60 p-2 rounded-full">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0" onClick={() => {navigate(`/profile/${owner._id}`)}}>
                      {profilePic ? (
                        <img src={profilePic} alt={channelName} className="h-11 w-11 rounded-full object-cover border border-neutral-700" />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-xs font-bold">
                          <User size={18} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-semibold leading-snug line-clamp-2">{title}</h3>
                      <div className="mt-1 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span className="truncate">{channelName}</span>
                        <span className="hidden sm:inline">•</span>
                        {/* <span>{formatViews(views)} views</span> */}
                        <span className="hidden sm:inline">•</span>
                        <span>{formatDate(createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-start ml-3">
                      <button
                       onClick={() => {dislike(video._id)}}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700/60 hover:bg-neutral-700 transition text-sm text-slate-100"
                        title="Dislike"
                      >
                        <span className="sm:inline">Dislike</span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
        </section>

        <div className="mt-8 text-center text-slate-400">
          {/* <p className="text-sm">End of liked videos</p> */}
        </div>
      </div>
    </div>
  )
}
