import React, { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { MoreVertical, Edit, Trash2, PlusCircle, PlaySquare } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Topbar } from "../components/Topbar"

export const Playlist = () => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setloading] = useState(false)
  const url = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  const fetchPlaylists = async () => {
    try {
      setloading(true)
      const res = await fetch(`${url}/api/playlist/get-user-playlist`,{credentials:"include"})
      const data = await res.json()
      setloading(false)
      const updated = data.data.map((pl) => ({ ...pl, isOptionsVisible: false }))
      setPlaylists(updated)
      // console.log(updated)
    } catch (error) {
      console.error("Error fetching playlists:", error)
    }
  }
  useEffect(() => {
    fetchPlaylists()
  }, [])

  const toggleOptions = (id) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl._id === id ? { ...pl, isOptionsVisible: !pl.isOptionsVisible } : pl
      )
    )
  }

  const deletePlaylist = async (playlistId) => { 
    const del = confirm("Are you sure you want to delete this playlist?")
    if(del){
      const res = await fetch(`${url}/api/playlist/delete-playlist/${playlistId}`,{method:"DELETE",credentials:"include"})
      const data = await res.json()
      // console.log(data)
      fetchPlaylists()
    }
   }

   if(loading) return <div>Loading...</div>

  return (
    <>
    <Topbar />
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Playlists</h1>
          <button 
          onClick={() => {navigate("/create-playlist")}}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            <PlusCircle className="w-5 h-5" /> Create New Playlist
          </button>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
  {playlists.length === 0 ? (
    <div>No playlists</div>
  ) : (
    playlists.map((playlist) => (
      <div
        key={playlist._id}
        className="cursor-pointer relative shadow-md hover:shadow-lg transition rounded-2xl bg-white p-4 flex flex-col gap-3 w-full"
        onClick={() => navigate(`/show-playlist/${playlist._id}`)}
      >
        <div className="flex flex-col justify-between items-start gap-5">
          {playlist.videos.length !== 0 ? (
            <img src={playlist.videos[0].thumbnail} />
          ) : (
            <img
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm0Dz-g-P7q-2fGiUKam9pE6plbkbAjg4I0g&s"
              }
              alt=""
            />
          )}

          <div className="flex w-full items-center justify-between">
            <h2 className="font-semibold text-lg ">
              <p>{playlist.name}</p>
            </h2>
            <button
              onClick={() => toggleOptions(playlist._id)}
              className="p-1 rounded-full hover:bg-gray-200 flex justify-end"
            >
              {/* <MoreVertical className="w-5 h-5" /> */}
            </button>
          </div>
        </div>

        {playlist.isOptionsVisible && (
          <div className="absolute right-3 top-32 bg-white border shadow-md rounded-xl py-2 w-32 z-10">
            <button
              onClick={() => {
                deletePlaylist(playlist._id);
              }}
              className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-gray-100"
            >
              {/* Light red cross svg */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    ))
  )}
</div>

      </div>
    </div>
    </>
  )
}
