import React, { useEffect, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { Topbar } from '../components/Topbar'

export const Subscriptions = () => {
  const [subscriptions, setsubscriptions] = useState([])
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()
  const url = import.meta.env.VITE_API_URL
  const getUserSubscriptions = async () => {
    setloading(true)
    const data = await fetch(`${url}/api/my-subscriptions`,{credentials:"include"})
    const res = await data.json()
    console.log(res)
    setloading(false)
    setsubscriptions(res.data)
  }
  const unSubscribe =  async (channelId) => { 
    const data = await fetch(`${url}/api/unsubscribe/${channelId}`, {
      method: "DELETE",
      credentials: "include"
    })
    const res = await data.json()
    console.log(res)
    getUserSubscriptions()
  }
  useEffect(() => {
    getUserSubscriptions()
  },[])
  if(loading) return <p>Loading...</p>
  if(subscriptions.length === 0) return <>
  <Topbar />
  No subscriptions found
  .</>
  return (
    <>
    <Topbar />
      <h1 className="text-2xl font-semibold mb-6">My Subscriptions</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((sub) => (
          <div 
            key={sub._id} 
            className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
          >
            {/* Channel Info */}
            <div className="cursor-pointer flex items-center gap-4" onClick={() => {navigate(`/profile/${sub.channel._id}`)}}>
              <img 
                src={sub.channel.profilePic || "https://ui-avatars.com/api/?name=" + sub.channel.username} 
                alt={sub.channel.username} 
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-medium text-gray-800">{sub.channel.username}</h2>
                <p className="text-sm text-gray-500">{sub.channel.email}</p>
              </div>
            </div>

            {/* Button */}
            <button
              className="mt-4 cursor-pointer w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 active:scale-95 transition"
              onClick={() => {unSubscribe(sub.channel._id)}}
            >
              Unsubscribe
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
