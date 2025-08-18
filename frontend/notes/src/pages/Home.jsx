import React from 'react'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import { useState } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utilis/axiosInstance'
import { useEffect } from 'react'
// import moment from "moment"
import Toast from '../components/Toast'
import EmptyCard from '../components/EmptyCard'
import AddNotesImg from '../../src/assets/images/png-clipart-computer-icons-notebook-sticky-notes-miscellaneous-desktop-wallpaper.png'
import NoDataImg from '../../src/assets/images/oops-404-error-with-broken-robot-concept-illustration_114360-5529.avif'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  })
  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null)

  const [isSearch, setIsSearch]= useState(false)

  const navigate = useNavigate()

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: 'edit' })
  }

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown : true,
      message,
      type,}
    )
  }
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",}
    )
  }
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes');

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log("an unexpected error occur, please try again",error)
    }
  }

  const deleteNote = async(data) => {
    const noteId= data._id
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`)

      if (response.data && !response.data.error) {
        showToastMessage("Note deleted Successfully", "delete")
        getAllNotes()
       
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message)
         {  console.log("an unexpected error occur, please try again") }
    }
  }

  const onSearchNote = async (query) => {
  try {
    const response = await axiosInstance.get("/search-notes", {
      params: { query },
    });

    if (response.data && response.data.notes) {
      setIsSearch(true);
      setAllNotes(response.data.notes);
    }
  } catch (error) {
    console.log(error);
  }
};

 const updateIsPinned = async (noteData)=>{
   const noteId = noteData._id
        try {
            const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
                isPinned:!noteData.isPinned
            })
            if (response.data && response.data.note) {
                showToastMessage("Note updated Successfully")
                getAllNotes()
                
            }
        } catch (error) {
           console.log(error)
        }
 }
const handleClearSearch=()=>{
  setIsSearch(false)
  getAllNotes()
}

  useEffect(() => {
    getAllNotes()
    getUserInfo();
    return () => { }
  }, [])


  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

      <div className="container mx-auto">
        {allNotes.length > 0 ? (<div className='grid grid-cols-3 gap-4 mt-8'>
          {allNotes.map((item) => {
            return (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() =>deleteNote(item)}
              onPinNote={() =>updateIsPinned(item)} />)
          })}

        </div>) : (<EmptyCard 
        imgSrc={isSearch ? NoDataImg: AddNotesImg}
        message={isSearch 
          ?`oops no note found matching your search`
          :`start creating urfirst notes. click Add button to create down your thoughts,
          reminders, ideas. Let's get started`}
          />)
        }
      </div>

      <button className='h-16 w-16 flex items-center justify-center rounded-2xl bg-blue-400 hover:bg-blue-700 absolute right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}>
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onclose={() => {
            setOpenAddEditModal({ isShown: false, data: null, type: "add" })
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage} />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onclose={handleCloseToast}
      />
    </>
  )
}

export default Home