import React, { useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { PostContext } from '../store/PostStore';
import { ToastContext } from '../component/ToastContext';

const EditModal = ({ showEditModal, setShowEditModal, currentPost, setCurrentPost }) => {
  const postStore = useContext(PostContext);
  const { showToast } = useContext(ToastContext);

  const handleUpdatePost = () => {
    postStore.handleUpdate(currentPost);
    showToast('Post édité avec succès');
    setShowEditModal(false);
  };

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentPost && (
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                value={currentPost.title}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formContent">
              <Form.Label>Contenu</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={currentPost.content}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, content: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleUpdatePost}>
          Sauvegarder
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
