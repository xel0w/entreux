import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../store/UserStore';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { ToastContext } from '../component/ToastContext';

const SettingsModal = ({ showModal, setShowModal }) => {
  const userStore = useContext(UserContext);
  const [username, setUsername] = useState(userStore.user.username);
  const [password, setPassword] = useState('');
  const [passwordVerif, setPasswordVerif] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const { showToastError, showToast } = useContext(ToastContext);

  useEffect(() => {
    userStore.checkLocalStorage()
  }, [])

  const handleSaveSettings = () => {
    if (password === passwordVerif) {
      const formData = new FormData();
      formData.append('profilePhoto', profilePhoto);
      formData.append('username', username);
      formData.append('password', password);
      try{
        userStore.saveSettings(formData)
        showToast('Paramètres modifiés avec succès');
      }catch{
        showToastError('Erreur lors de la mise à jour des paramètres');
      }
      setPassword('');
      setPasswordVerif('')
      setShowModal(false);
    } else {
      showToastError('Les mots de passe ne correspondent pas');
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file.size <= 2000000) {
      setProfilePhoto(file);
    } else {
      showToastError('La taille de l\'image dépasse 2 Mo');
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier les réglages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPicture">
            <Form.Label>Photo de profil</Form.Label>
            <Form.Control
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleProfilePhotoChange}
            />
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder={userStore.user.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Nouveau mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPasswordVerif">
            <Form.Label>Vérification</Form.Label>
            <Form.Control
              type="password"
              placeholder="Vérification"
              value={passwordVerif}
              onChange={(e) => setPasswordVerif(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          <FontAwesomeIcon icon={faXmark} style={{ color: '#ffffff' }} />
        </Button>
        <Button variant="primary" onClick={handleSaveSettings}>
          <FontAwesomeIcon icon={faFloppyDisk} style={{ color: '#ffffff' }} />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
