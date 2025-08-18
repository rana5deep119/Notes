import React from 'react'
import { useState } from 'react'
import {FaRegEye,FaRegEyeSlash} from "react-icons/fa6"

const Password = ({value, onChange, placeholder}) => {

  const[isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  } 
  return (
    <div className='flex items-center justify-between border rounded px-5 py-2 '>
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />
      

      {isShowPassword ? (
        <FaRegEyeSlash
          size={22}
          onClick={toggleShowPassword}
          className='cursor-pointer text-slate-500'
        />
      ) : (
        <FaRegEye
          size={22}
          onClick={toggleShowPassword}
          className='cursor-pointer text-slate-500'
        />
      )}
    </div>
  )
}

export default Password