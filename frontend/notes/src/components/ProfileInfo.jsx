import React from 'react'
import { getInitials } from '../utilis/helper'

const ProfileInfo = ({userInfo ,onLogout}) => {
   if (!userInfo) {
    return <p className="text-sm text-slate-600">Loading...</p>;
  }
  return (
    <div className='flex items-center gap-3'>
        <div className='flex items-center justify-center w-12 h-12 rounded-full text-slate-900 bg-slate-100 font-medium'>
          {getInitials(userInfo.fullName)}</div>
        <div>
            <p className='font-medium text-sm'>{userInfo.fullName}</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
  )
}

export default ProfileInfo;