import React, { createContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastContent, setToastContent] = useState('');

  const showToast = (content) => {
    setToastContent(content);
    toast.success(content, { position: 'bottom-right' });
  };

  const showToastError = (content) => {
    setToastContent(content);
    toast.error(content, { position: 'bottom-right' });
  };

  const hideToast = () => {
    setToastContent('');
    toast.dismiss();
  };

  return (
    <ToastContext.Provider value={{ showToast, showToastError, hideToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
