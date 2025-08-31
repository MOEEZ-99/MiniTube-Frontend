import React, { useState,useRef } from "react"
import { useNavigate } from "react-router-dom"
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette"

export const CreatePlaylist = () => {
    const url = import.meta.env.VITE_API_URL
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()
  const btnRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    btnRef.current.disabled = true
    const data = await fetch(`${url}/api/playlist/create-playlist`,{
        method:"POST",
        credentials:"include",
        body:JSON.stringify({
            name:title,
            description
        }),
        headers:{
            "Content-Type": "application/json"
        }
    })
    const res = await data.json()
    // console.log(res)
    btnRef.current.disabled = false
    setloading(false)
    if(res.statusCode===200){
        navigate("/playlists")
        setloading(false)
    }else{
        alert("Error creating playlist")
        setloading(false)
    }
    // console.log(res)
  }
  if(loading){
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Create New Playlist</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter playlist title"
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter playlist description"
              rows={4}
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition"
            ref={btnRef}
          >
            Create Playlist
          </button>
        </form>
      </div>
    </div>
  )
}
