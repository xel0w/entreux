import '../App.css'
import React, { useContext, useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { UserContext } from '../store/UserStore'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContext } from './ToastContext';
import 'react-toastify/dist/ReactToastify.css';
import { observer } from 'mobx-react'


const Connexion = observer(() => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const userStore = useContext(UserContext)
  const navigate = useNavigate()
  const { showToast, showToastError } = useContext(ToastContext);

  useEffect(() => {
    if (userStore.user) {
      navigate('/')
    }
  }, [userStore.user])

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isSignUp) {
        userStore.signUp(username, password)
        showToast('Inscription réussie')
        setIsLoading(false);
        setIsSignUp(!isSignUp)
      } else {
        userStore.signIn(username, password)
        showToast('Connection réussie')
        setTimeout(() => {
          userStore.checkLocalStorage();
          navigate('/');
        }, 1000);
      }
      setPassword('');
    } catch (error) {
      setTimeout(() => {
      setIsLoading(false);
      showToastError('Erreur lors de votre connexion');
    }, 1000);
    }
  };
  
  return (
    <div className="App">
      <div className="h-100 contain d-flex align-items-center">
      {isLoading ? (
        <div className="custom-loader"></div>
      ) : (
        <Card className="container w-25 p-5 connect">
          <h1>{isSignUp ? 'Inscription' : 'Connexion'}</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {isSignUp ? "S'inscrire" : 'Se connecter'}
            </button>
            <div className="form-text mt-2">
              {isSignUp
                ? 'Vous avez déjà un compte ?'
                : "Vous n'avez pas de compte ?"}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Connectez-vous ici' : 'Inscrivez-vous ici'}
              </button>
            </div>
          </form>
        </Card>
        )}
      </div>
    </div>
  )
})

export default Connexion
