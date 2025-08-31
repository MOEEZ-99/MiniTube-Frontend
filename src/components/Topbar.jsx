import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import searchSvg from "../assets/search.svg"
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { setDisplay } from '../features/sidebarSlice'

export const Topbar = () => {
  const dispatch = useDispatch()
    const [user, setuser] = useState({})
    const url = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
//   const user = useSelector(state => state.user.user)
    useEffect(() => {
    ;(async () => {
      const res = await fetch(`${url}/api/user`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        // console.log(data)
        setuser(data)
      }
    })()
  }, []) // r   
  return (
    <>
        <div className="topbar w-full flex items-center md:justify-center p-2 gap-5">
        <div className="search w-[45%] md:flex items-center hidden">
           <input type="text" placeholder='Search here' className='hidden md:block outline-0 px-3 py-2 text-gray-600 border-1 border-slate-600 w-full'/>
           <div className="bg-slate-200 cursor-pointer px-4 py-[11px]">
              <img src={searchSvg} alt="" className=''/>
           </div>

        </div>
        <div 
        onClick={() => {
          dispatch(setDisplay(true))
          console.log("Toggle Sidebar Display")
        }}
        className="burger md:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="3" y1="6" x2="21" y2="6"/>
  <line x1="3" y1="12" x2="21" y2="12"/>
  <line x1="3" y1="18" x2="21" y2="18"/>
</svg>
</div>
           <button onClick={async () => {
             navigate("/login")
      const data = await fetch(`${url}/api/logout`, {
        method: "GET",
        credentials: "include"
      })
      const res = await data.json()
     }} className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 hover:shadow-lg active:scale-95 transition-all">
  Logout
</button>

        

    <div>
     

    </div>
          <div className='max-w-[42px] absolute right-2 rounded-full bg-slate-500 shadow-md'>
             <img src={user?.data?.profilePic} alt="" className='rounded-full cursor-pointer' onClick={()=>{navigate("/my-profile")}}/>
          </div>

      </div>
    </>
  )
}
