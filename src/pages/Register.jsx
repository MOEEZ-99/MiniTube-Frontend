import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
  const url = import.meta.env.VITE_API_URL
  const [loading, setloading] = React.useState(false)
  const navigate = useNavigate()
  const register = async (e) => {
    setloading(true)
    e.preventDefault()
    const formData = new FormData(e.target);
    const data = await fetch(`${url}/api/register`, {
      method: "POST",
        body: formData,
        credentials: "include" 
    })
    console.log(data)
    if(data.status===201){
      alert("Registed successfully")
      setloading(false)
      navigate("/login")
    } 
    else if(data.status === 409){
      alert("User with email or username already exists")
      setloading(false)
    }
    else{
      alert("Something went wrong while registering")
      setloading(false)
    }
   }
   if(loading){
         return (
           <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-300 dark:to-slate-350">
             <div className="relative w-16 h-16">
               <div className="absolute inset-0 rounded-full border-4 border-slate-300 dark:border-red-500"></div>
               <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
             </div>
           </div>
         )
        }
  return (
    <>
        <div className='bg-gradient-to-b from-[#ffc4c4] to-[#fff4f4] w-full h-[100vh] flex flex-col items-center justify-center gap-5   '>
            <h1 className='text-5xl'>Register</h1>
            <p>Create an account to continue</p>

            <form encType='multipart/form-data' className='w-[35%] flex flex-col gap-4' onSubmit={register}>
                <input type="text" placeholder='Enter your name' name='fullName' required className='text-gray-600 w-full px-4 py-3 outline-0 rounded-xl border-2 border-slate-400'/>
                <input type="text" placeholder='Enter username' name='username' required className='text-gray-600 w-full px-4 py-3 outline-0 rounded-xl border-2 border-slate-400'/>
                <input type="email" placeholder='Enter your email' name='email' required className='text-gray-600 w-full px-4 py-3 outline-0 rounded-xl border-2 border-slate-400'/>
                <input type="password" placeholder='Enter your password' name='password' required className='text-gray-600 w-full px-4 py-3 outline-0 rounded-xl border-2 border-slate-400'/>

                <label htmlFor="profilePic" className='font-bold'>Profile Pic (required)</label>
                <input type="file" placeholder='Upload your profile' name='profilePic' id='profilePic'/>

                <label htmlFor="profilePic" className='font-bold'>Cover Image (if any)</label>
                <input type="file"  name='coverImage' id='coverImage'/>
                <button type='submit' className='text-[#ffffff] w-full px-2 py-3 bg-[#ff5d5d] cursor-pointer hover:bg-[#ff3d3d] rounded-xl'>Register</button>
            </form>
        </div>
    </>
  )
}
