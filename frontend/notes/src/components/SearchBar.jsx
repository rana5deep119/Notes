import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
    return (
        <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
            <input
            className='text-xm bg-transparent w-full outline-none py-[11px]'
            type="text"
            value={value}
            onChange={onChange}
            placeholder='Search Notes'
            />
            {value && (
                <IoMdClose 
                onClick={onClearSearch}
                className='text-xl cursor-pointer text-slate-500 hover:text-black mr-3'/>
            )}
            <FaMagnifyingGlass 
            onClick={handleSearch}
            className='text-xl cursor-pointer text-slate-400 hover:text-black'/>
        </div>
    )
}

export default SearchBar