import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
  return (
    <div className='flex flex-col items-center justify-between mt-20 '>
        <img src={imgSrc} alt="No notes" className='w-60' />
        <p className=' w-1/2 text-sm font-medium text-slate-700 leading-7 text-center mt-5'>{message}</p>
    </div>
  )
}

export default EmptyCard