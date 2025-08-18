import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Password from '../components/Password'
import { validateEmail } from '../utilis/helper';
import axiosInstance from '../utilis/axiosInstance';

const Login = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const[error,setError]=useState(null);

    const navigate = useNavigate()
     
    const handleLogin =async (e)=>{
        e.preventDefault()
        if (!validateEmail(email)){
            setError("Please Enter a valid email")
            return;
        }

        if (!password) {
        setError("Please enter the password");
         return;
        }
        
        setError("")
       try {
        const response = await axiosInstance.post("/login",{
            email:email,
            password:password
        })
        if(response.data && response.data.accessToken){
            localStorage.setItem("token",response.data.accessToken)
            navigate("/")
        }
       } catch (error) {
        //hndle error
        if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message)
        }
        else(
            setError("An unexpected error occured, please try again")
        )
       }
    };
    return (
        <>

            <div className='flex justify-center items-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <form onSubmit={handleLogin} className='flex flex-col gap-4'>
                        <h4 className="text-2xl mb-7">Login</h4>

                        <input type="text" 
                        placeholder="Email" 
                        className='flex items-center justify-between border rounded px-5 py-2 '
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}/>

                   {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                      <Password
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)} />
                   {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                        <button type="submit" className="bg-blue-500 text-white font-bold ">
                            Login
                        </button>

                        <p className="text-sm text-center mt-4">
                            Not registered yet?{" "}
                            <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                                Create an Account
                            </Link>
                        </p>
                    </form>
                </div>

            </div>
        </>
    )
}

export default Login