import { CookingPot } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const MyProfile = () => {
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({fullName:""})
  const [coverImage, setcoverImage] = useState(null)
  const [profilePic, setprofilePic] = useState(null)
  const url = import.meta.env.VITE_API_URL

  const getUser = async () => { 
    const data = await fetch(`${url}/api/user`, { credentials:"include" })
    const res = await data.json()
    console.log(res)
    setUser(res.data)
    setFormData(res.data)
  }

  useEffect(() => {
    getUser()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target
  //   setFormData({ ...formData, [name]: files[0] })
  // }

  // const handleUpdate = async (field) => {
  //   const fd = new FormData()
  //   fd.append(field, formData[field])

  //   await fetch(`${url}/api/user/update`, {
  //     method: "PUT",
  //     credentials: "include",
  //     body: fd
  //   })
  //   getUser()
  //   setEditMode(false)
  // }

  const handleCoverChange = (e) => { 
    setcoverImage(e.target.files[0])
   }
  const updateCover = async (id) => { 
     const fd = new FormData()
    fd.append("coverImage", coverImage)
      const data = await fetch(`${url}/api/update-coverImage`, {
        method: "PUT",
        credentials: "include",
        body:fd,
      })
      const res = await data.json()
      // console.log(res)
      window.location.reload(true)
   }
   const updateProfile = async (id) => {
     const fd = new FormData()
    fd.append("profilePic", profilePic)
      const data = await fetch(`${url}/api/update-profilePic`, {
        method: "PUT",
        credentials: "include",
        body:fd,
      })
      const res = await data.json()
      // console.log(res)
      window.location.reload(true)
    }
   const updateUser = async () => { 
      const data = await fetch(`${url}/api/update-user`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const res = await data.json()
      // console.log(res)
      window.location.reload(true)
    }

  if (!user) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-center w-full">
      {/* Cover Image */}
      <div className="relative w-full h-48 sm:h-64 bg-gray-200 rounded-b-2xl shadow-md">
        {/* <img 
          src={user.coverImage || "https://placehold.co/1200x300?text=No+Cover"} 
          alt="Cover" 
          className="w-full h-full object-contain"
        /> */}
        <div
  className="w-full h-full bg-no-repeat bg-center bg-cover"
  style={{ backgroundImage: `url(${user.coverImage || "https://placehold.co/1200x300?text=No+Cover"})` }}
></div>

        {/* Profile Pic */}
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
          <img 
            src={user.profilePic || "https://placehold.co/200?text=No+Avatar"} 
            alt="Profile" 
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-xl"
          />
        </div>
        {/* Edit Cover */}
        {editMode && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-lg shadow">
            <input 
              type="file" 
              name="coverImage" 
              onChange={handleCoverChange} 
              className="text-sm"
            />
            <button 
              onClick={() => updateCover(user._id)} 
              className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save Cover
            </button>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="mt-20 text-center px-4 w-full max-w-xl">
        {editMode ? (
          <div className="flex flex-col gap-4 items-center w-full">
            {/* Edit Profile Pic */}
            <div className="bg-gray-100 p-4 rounded-lg w-full shadow">
              <p className="font-semibold text-gray-700 mb-2">Update Profile Picture</p>
              <input type="file" name="profilePic" onChange={(e)=>{setprofilePic(e.target.files[0])}}/>
              <button 
                onClick={() => updateProfile(user._id)} 
                className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Save Picture
              </button>
            </div>

            {/* Edit Full Name */}
            <div className="bg-gray-100 p-4 rounded-lg w-full shadow">
              <p className="font-semibold text-gray-700 mb-2">Update Full Name</p>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName || ""} 
                onChange={handleChange} 
                className="border rounded p-2 w-full"
              />
              <button 
                onClick={() => updateUser()} 
                className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Save Name
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <p className="text-gray-500">@{user.username}</p>
            <p className="mt-2 text-sm text-gray-600">{user.email}</p>
            <p className="mt-1 text-xs text-gray-400">Joined: {new Date(user.createdAt).toDateString()}</p>
          </>
        )}

        {/* Toggle Edit Mode */}
        <button 
          onClick={() => setEditMode(!editMode)} 
          className="mt-6 bg-gray-900 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 transition"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>
    </div>
  )
}
