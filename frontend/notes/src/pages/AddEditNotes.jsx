import React, { useState } from 'react'
import TagInput from '../components/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../utilis/axiosInstance'

const AddEditNotes = ({ noteData, type, getAllNotes, onclose, showToastMessage }) => {
    const [title, setTitle] = useState(noteData?.title || "")
    const [content, setContent] = useState(noteData?.content || "")
    const [tags, setTags] = useState(noteData?.tags || [])

    const [error, setError] = useState("")

    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags
            })
            if (response.data && response.data.note) {
                showToastMessage("Note added Successfully")
                getAllNotes()
                onclose()
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) { setError(error.response.data.message) }
        }
    }
    const editNote = async () => { 
        const noteId = noteData._id
        try {
            const response = await axiosInstance.put(`/edit-note/${noteId}`, {
                title,
                content,
                tags
            })
            if (response.data && response.data.note) {
                showToastMessage("Note updated Successfully")
                getAllNotes()
                onclose()
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) { setError(error.response.data.message) }
        }
    }

    const handleAddNote = () => {
        if (!title) {
            setError("please enter the title");
            return;
        }
        if (!content) {
            setError("please enter the content")
            return;
        }
        setError("");

        if (type === 'edit') {
            editNote()
        }
        else {
            addNewNote()
        }
    }
    
    return (
        <div className='relative'>

            <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-100' onClick={onclose}>
                <MdClose className='text-xl text-slate-400' />
            </button>

            <div className='flex flex-col gap-2'>
                <label className='text-slate-400 text-xs'>Title</label>
                <input
                    type="text"
                    placeholder='Go to gym '
                    className='text-slate-900 text-2xl outline-none'
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="text-slate-400 text-xs">CONTENT</label>
                <textarea
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className="mt-3 flex flex-col gap-2">
                <label className="text-slate-400 text-xs">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />

            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

            <button
                className="w-full bg-blue-600 text-white font-medium mt-5 px-4 py-2 rounded"
                onClick={handleAddNote}
            >
                {type === 'edit' ? "UPDATE" : "ADD"}
            </button>


        </div>
    )
}

export default AddEditNotes