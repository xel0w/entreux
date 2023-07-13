import React, { useContext } from 'react'
import { UserContext } from '../store/UserStore'
import { useNavigate, Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import logo from '../assets/img/entreux.png'
import { ToastContext } from './ToastContext'
import '../style/menuTopStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import profilDefault from '../assets/img/default.jpg'
import { observer } from 'mobx-react'

const MenuTop = observer(() => {
  const userStore = useContext(UserContext)
  const navigate = useNavigate()
  const { showToastError } = useContext(ToastContext)
  const handleLogout = () => {
    localStorage.removeItem('token')
    setTimeout(() => {
      showToastError('Vous êtes déconnecté')
      userStore.checkLocalStorage()
      navigate('/login')
    }, 1000)
  }

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="MenuTop">
      <div className="container">
        <Navbar.Brand href="/">
          <img src={logo} alt="" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {userStore.user && (
              <Nav.Link as={Link} to="/">
                Accueil
              </Nav.Link>
            )}
            {!userStore.user ? (
              <Nav.Link as={Link} to="/login">
                Se connecter
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/profil">
                  Mon Profil
                </Nav.Link>
                <Nav.Link as={Link} to="/newpost">
                  Nouveau Post
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ms-auto menutopdroite">
            {userStore.user && (
              <>
                <Navbar.Text className="mr-3">
                  Bonjour, {userStore.user.username}
                </Navbar.Text>
                <div className="profile-photo ms-3">
                  <img
                    src={
                      userStore.user.profilePhoto
                        ? '/src/assets/photoProfil/' +
                          userStore.user.profilePhoto.split('\\').pop()
                        : profilDefault
                    }
                    alt="Photo de profil"
                  />
                </div>
                <Nav.Link className="ms-3" onClick={handleLogout}>
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    style={{ color: '#ff0000' }}
                  />
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
})

export default MenuTop
