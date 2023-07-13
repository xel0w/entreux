import './App.css'
import React, { useContext, useEffect } from 'react';
import { UserContext } from './store/UserStore';
import MenuTop from './component/MenuTop';
import { useNavigate, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

function App() {
  const userStore = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStore.user) {
      navigate('/login');
    }
  }, []);

  return (
    <div className="App">
      <ToastContainer position="bottom-right" />
      <MenuTop/>
      <Outlet />
    </div>
  );
};
export default App;
