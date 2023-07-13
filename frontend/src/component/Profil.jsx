import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../store/UserStore'
import { PostContext } from '../store/PostStore'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare, faGear } from '@fortawesome/free-solid-svg-icons'
import '../style/profilStyle.css'
import { ToastContext } from './ToastContext'
import SettingsModal from '../modal/SettingsModal'
import EditModal from '../modal/EditModal'
import profilDefault from '../assets/img/default.jpg';

const Profil = observer(() => {
  const userStore = useContext(UserContext)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const navigate = useNavigate()
  const postStore = useContext(PostContext)
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (!userStore.user) {
      navigate('/')
    }
    postStore.getAllPostsByUser(userStore.user.username)
  }, [userStore.user])

  const handleEdit = (article) => {
    setCurrentPost(article)
    setShowEditModal(true)
  }

  return (
    <div className="Profil">
      <div className="profile-photo-big">
        <img src={userStore.user.profilePhoto ? '/src/assets/photoProfil/'+userStore.user.profilePhoto.split('\\').pop() : profilDefault} alt="Photo de profil" />
      </div>
      <div className="topProfil">
        <h2 className="ml-3"> Mes posts</h2>
        <Button
          variant="primary"
          className="buttonTop"
          onClick={() => setShowSettingsModal(true)}
        >
          <FontAwesomeIcon icon={faGear} style={{ color: '#000000' }} />
        </Button>
      </div>
      <SettingsModal
        showModal={showSettingsModal}
        setShowModal={setShowSettingsModal}
      />
      {postStore.postsPerso.length === 0 ? (
        <h3>Vous n'avez pas de posts</h3>
      ) : (
        <div className="row m-5 p-4 col-12 justify-content-center">
          {postStore.postsPerso.map((article) => (
            <div className="col-md-10" key={article._id}>
              <div className="card mb-4 p-4 bg-light">
                <div className="card p-4 d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.content}</p>
                  <small className="card-text dateProfil">
                    {postStore.formatDate(article.date)}
                  </small>
                  </div>
                  <div className="btnBottomCard">
                    <button
                      className="btnDeletePost"
                      onClick={() => {
                        postStore.handleDeletePost(article._id)
                        showToast('Post supprimé')
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: '#ff0000' }}
                      />
                    </button>
                    <button
                      className="btnEditPost"
                      onClick={() => handleEdit(article)}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ color: '#ffBB00' }}
                      />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        currentPost={currentPost}
        setCurrentPost={setCurrentPost}
      />
    </div>
  )
})

export default Profil
