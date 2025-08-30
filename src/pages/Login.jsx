import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export const Login = () => {
    const navigate = useNavigate()
    const [errors, seterrors] = useState("")
    const url = import.meta.env.VITE_API_URL
    const submit = async (e) => {
        e.preventDefault()
        const data = await fetch(`${url}/api/login`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: e.target.email.value,
                password: e.target.password.value
            }),
            credentials: "include" 
        })
        console.log(data)
        if(data.status === 200){
            navigate("/")
        } else{
            if(data.status === 404){
                seterrors("User not found")
            }
            if(data.status === 401){
                seterrors("Inavlid credentials")
            }
        }
    }
  return (
    <>
        <div className='main h-[100vh] w-full flex items-center justify-center'>
            <div className='flex flex-col items-center gap-10 md:w-[50%]'>
                <h3 className='text-5xl'>Welcome Back</h3>
                <p className=' text-slate-500'>Welcome back! Please enter your details</p>

                <form className='flex flex-col gap-4 w-full ' onSubmit={submit}>
                    <label htmlFor="email" className='font-bold'>Email</label>
                    <input type="text" placeholder='Enter your email' id='email' className='text-gray-600 w-full px-4 py-3 outline-0 rounded-xl border-2 border-slate-400'/>

                    <label htmlFor="password" className='font-bold'>Password</label>
                    <input type="password" placeholder='Enter your password' id='password' className='text-gray-600 w-full px-4 py-3 outline-0 rounded-xl border-2 border-slate-400'/>
                    
                        <input type="submit" value="Login" className='text-[#ffffff] w-full px-2 py-3 bg-[#ff5d5d] cursor-pointer hover:bg-[#ff3d3d] rounded-xl'/>

                </form>

                <p className='flex gap-2'>Dont have an account? <span onClick={() => navigate("/register")} className='text-gray-600 cursor-pointer hover:underline'>Register Now</span></p>

                <p className='text-red-600 font-bold text-4xl'>{errors}</p>

            </div>

        </div>
    </>
  )
}
