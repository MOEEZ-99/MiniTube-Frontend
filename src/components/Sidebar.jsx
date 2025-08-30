import React, { useEffect, useState } from 'react'
import burgerSvg from "../assets/burger.svg"
import homeSvg from "../assets/home.svg"
import subsciptionsSvg from "../assets/subscriptions.png"
import librarySvg from "../assets/library.svg"
import yourVideosSvg from "../assets/yourVideos.svg"
import likedVideosSvg from "../assets/likedVideos.svg"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setShow } from '../features/sidebarSlice'
import { useLocation } from 'react-router-dom'
import { setDisplay } from '../features/sidebarSlice'
export const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [show, setshow] = useState(true)
    const sidebar = useSelector((state) => state.sidebar.show);
    const display = useSelector((state) => state.sidebar.display);
    const dispatch = useDispatch();

    useEffect(()=>{
        // console.log(location.pathname)   
        console.log("Display:", display)
    },[location.pathname])

    const hideSidebar = () => { 
        if(display) {
            dispatch(setDisplay(false))
        }
        else{
          setshow(!show)
          dispatch(setShow(!show))
        }
    }
  return (
    <nav className={`flex flex-col items-start gap-4 w-auto fixed ${display ? "left-0 z-400 bg-red-500 h-screen" : "max-[786px]:left-[-100%]"}`}>
        {/* Logo */}
            <div className='text-[#ff5d5d] font-extrabold text-2xl flex items-center gap-3 px-3 py-3'>
                <img src={burgerSvg} alt="" className='cursor-pointer' onClick={hideSidebar}/>
                {show && "MeTube"}</div>
        {/* Logo */}

        {/* Icons */}

           <div>

<div className={`flex items-center gap-4 cursor-pointer px-4 w-full py-4 ${location.pathname === "/" ? "bg-[#ff5d5d] text-white" : ""}`} onClick={()=>{navigate("/")}}>
  <img src={homeSvg} alt="" /> {show && "Home"}
</div>

<div className={`flex items-center gap-4 cursor-pointer px-4 w-full py-4 ${location.pathname === "/my-videos" ? "bg-[#ff5d5d] text-white" : ""}`} onClick={()=>{navigate("/my-videos")}}>
  <img src={yourVideosSvg} alt="" /> {show && "My Videos"}
</div>

<div className={`flex items-center gap-4 cursor-pointer px-4 w-full py-4 ${location.pathname === "/subscriptions" ? "bg-[#ff5d5d] text-white" : ""}`} onClick={()=>{navigate("/subscriptions")}}>
  <img src={subsciptionsSvg} alt="" /> {show && "Subscriptions"}
</div>

<div className={`flex items-center gap-4 cursor-pointer px-4 w-full py-4 ${location.pathname === "/playlists" ? "bg-[#ff5d5d] text-white" : ""}`} onClick={()=>{navigate("/playlists")}}>
  <img src={librarySvg} alt="" /> {show && "Playlists"}
</div>

<div className={`flex items-center gap-4 cursor-pointer px-4 w-full py-4 ${location.pathname === "/liked-videos" ? "bg-[#ff5d5d] text-white" : ""}`} onClick={()=>{navigate("/liked-videos")}}>
  <img src={likedVideosSvg} alt="" /> {show && "Liked Videos"}
</div>



           </div>

        {/* Icons */}


        {show ? <><hr className='text-black w-full'/>

        <div className='px-3'>
            {/* <h1 className='text-[#ff5d5d] font-extrabold '>SUBSCRIPTIONS</h1> */}

        </div></>: <div className='px-3'></div>}

    </nav>
  )
}
