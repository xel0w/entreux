import React, { useState, useContext } from 'react'
import { UserContext } from '../store/UserStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { ToastContext } from './ToastContext'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import '../App.css'
import { postStore } from '../store/PostStore'

const NewPost = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const userStore = useContext(UserContext)
  const navigate = useNavigate()
  const { showToast } = useContext(ToastContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    postStore.newPost(title, content, userStore.user.username, Date.now())
    showToast('Nouvelle publication ajoutée')
    navigate('/profil')
    setTitle('')
    setContent('')
  }

  return (
    <div className="NewPost">
      <div className="formul">
        <h2>Créez un nouveau post</h2>
        <div className="container pt-4">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <input
                type="text"
                className="form-control titleNewPost"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Article</label>
              <textarea
                className="form-control"
                id="content"
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary mt-4 w-100">
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  style={{ color: '#ffffff' }}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewPost
