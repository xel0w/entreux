import React, { useState, useContext, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import '../style/accueilStyle.css'
import { UserContext } from '../store/UserStore'
import { PostContext } from '../store/PostStore'
import Posts from './Posts'
import { observer } from 'mobx-react'
import { ToastContext } from './ToastContext';

const Accueil = observer(() => {
  const [showModal, setShowModal] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [selectedPostId, setSelectedPostId] = useState('')
  const { showToast } = useContext(ToastContext);

  const userStore = useContext(UserContext)
  const postStore = useContext(PostContext)

  useEffect(() => {
    postStore.getAllPosts()
  }, [])
  
  const openModal = (postId) => {
    setShowModal(true)
    setSelectedPostId(postId)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPostId('')
    setCommentContent('')
  }

  return (
    <div className="Accueil">
      <h2>Voici tous les posts:</h2>
      <div className="row justify-content-center">
        {postStore.posts.map((post) => (
          <Posts post={post} openModal={openModal} key={post._id}/>
        ))}
      </div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un commentaire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="commentContent">
            <Form.Label>Contenu du commentaire</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              postStore.addComment(selectedPostId, commentContent, userStore.user.username);
              closeModal();
              showToast('Commentaire ajouté');
            }}
          >
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
})

export default Accueil
