import { makeAutoObservable, autorun } from 'mobx';
import { createContext } from 'react';
import axios from 'axios';
import * as jose from 'jose';

class UserStore {
  user = undefined;
  token = undefined;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      this.checkLocalStorage();
    });
  }

  setUser(user) {
    this.user = user;
  }

  clearUser() {
    this.user = undefined;
  }

  checkLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jose.decodeJwt(token);
        if (decodedToken) {
          this.setUser(decodedToken.data);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      this.clearUser();
    }
  }

  saveSettings(formData){
    axios
    .post(`http://localhost:3000/updateUser/${this.user.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((resp) => {
      localStorage.removeItem('token');
      localStorage.setItem('token', resp.data.token);
      setTimeout(() => {
        userStore.checkLocalStorage();
      }, 100);
    })
    .catch((error) => {
      console.error(
        'Erreur lors de la mise à jour de l\'utilisateur :',
        error
      );
      return error
    });

  }

  async signUp(username, password){
    await axios.post('http://localhost:3000/signUp', { username, password });
  }

  async signIn(username, password){
    const resp = await axios.post('http://localhost:3000/signIn', { username, password });
    localStorage.setItem('token', resp.data.token);
  }

}

const userStore = new UserStore();

const UserContext = createContext(userStore);

export { userStore, UserContext };
