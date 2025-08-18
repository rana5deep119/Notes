import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import Password from '../components/Password'
import { validateEmail } from '../utilis/helper'
import axiosInstance from '../utilis/axiosInstance'

const SignUp = () => {
  
  const[name , setName] = useState("")
  const[email , setEmail] = useState("")
  const[password , setPassword] = useState("")
  const[error , setError] = useState(null)
  
  const navigate = useNavigate()
  
  const handleSignup=async(e)=>{
    e.preventDefault()

    if(!name){
      setError("Please enter the name")
      return ;
    }
    if(!validateEmail(email)){
      setError("Please enter valid email")
      return ;
    }
    if(!password){
      setError("Please enter password")
      return ;
    }

    setError('')
    try {
            const response = await axiosInstance.post("/create-account",{
                fullName:name,
                email:email,
                password:password
            })

             if(response.data && response.data.error){
              setError(response.data.message)
              return
             }
            if(response.data && response.data.accessToken){
                localStorage.setItem("token",response.data.accessToken)
                navigate("/")
            }
           } 
           catch (error) {
            //hndle error
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }
            else(
                setError("An unexpected error occured, please try again")
            )
           }
  }
  return (
    <>
      {/* <Navbar /> */}
      <div className='flex justify-center items-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignup} className='flex flex-col gap-4'>
            <h4 className="text-2xl mb-7">SignUp</h4>

            <input
              type="text"
              placeholder="Name"
              className='flex items-center justify-between border rounded px-5 py-2 '
              onChange={(e) => setName(e.target.value)}
              value={name} />

              <input type="text" 
                        placeholder="Email" 
                        className='flex items-center justify-between border rounded px-5 py-2 '
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}/>

                   {/* {error && <p className="text-red-500 text-xs pb-1">{error}</p>} */}

                      <Password
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)} />

                   {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                        <button type="submit" className="bg-blue-500 text-white font-bold ">
                            Create Account
                        </button>

                        <p className="text-sm text-center mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp