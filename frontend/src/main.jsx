import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Connexion from './component/Connexion'
import Profil from './component/Profil'
import Error from './component/Error'
import NewPost from './component/NewPost'
import Accueil from './component/Accueil'
import { UserContext, userStore } from './store/UserStore';
import './index.css'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css';
import { ToastProvider } from './component/ToastContext';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/newpost",
        element: <NewPost/>,
      },
      {
        path: "/login",
        element: <Connexion/>,
      },
      {
        path: "/profil",
        element: <Profil/>
      },
      {
        path: "/",
        element: <Accueil/>
      },
      {
        path: "/*",
        element: <Error/>
      },
    ],
  },
]);

const token = localStorage.getItem('token');
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    console.error('Erreur lors de la configuration de l\'intercepteur :', error);
    return Promise.reject(error);
  }
);
if (token){

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const expirationDate = new Date(decodedToken.exp * 1000);
  const currentDate = new Date();

  if (currentDate > expirationDate) {
    localStorage.removeItem('token')
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContext.Provider value={userStore}>
    <ToastProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </ToastProvider>
  </UserContext.Provider>,
)
