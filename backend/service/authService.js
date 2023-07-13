const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const {getUserByUsername} = require('./userService')

const SALT_ROUNDS = 10
const JWT_SECRET = 'JHJKKJHKijjh89HGFjgb'

function hashPassword(plainTextPassword) {
    return bcrypt.hash(plainTextPassword, SALT_ROUNDS)
}
function comparePasswords(plainTextPassword, hash) {
    return bcrypt.compare(plainTextPassword, hash)
}

function createToken(data){
    return jwt.sign({ data }, JWT_SECRET, {
        expiresIn: "1d"
    });
}

exports.signIn = async (username, password) => {
    try {
      const user = await getUserByUsername( username );
  
      if (!user) {
        throw new Error( 'Username / Password incorrect');
      }
  
      try {
        const match = await comparePasswords(password, user.password);
  
        if (match) {
          const token = createToken({ username: user.username, id: user._id, profilePhoto: user.profilePhoto });
          return { token };
        } else {
          return { error: 'Username / Password incorrect' };
        }
      } catch (error) {
        console.error(error);
        throw new Error('Une erreur s\'est produite lors de la vérification du mot de passe.');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Une erreur s\'est produite lors de la recherche de l\'utilisateur.');
    }
  };
  


exports.signUp = async (username, password) => {
    try {
      const existingUser = await getUserByUsername(username);
  
      if (existingUser) {
        throw new Error('Veuillez en choisir un autre username.');
      }
  
      const hashedPassword = await hashPassword(password);
  
      console.log('SIGNUP ' + username);
      const user = new User({
        username,
        password: hashedPassword
      });
  
      try {
        const savedUser = await user.save();
        console.log(savedUser);
        return null; // Aucune erreur
      } catch (error) {
        console.error(error);
        throw new Error('Une erreur s\'est produite lors de l\'enregistrement de l\'utilisateur.');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Une erreur s\'est produite lors de la vérification de l\'existence de l\'utilisateur.');
    }
  };
  exports.renewToken = async (username) => {
    try {
      const user = await getUserByUsername( username );
  
      if (!user) {
        throw new Error( 'Username / Password incorrect');
      }
  
      try {
          const token = createToken({ username: user.username, id: user._id, profilePhoto: user.profilePhoto });
          return { token };
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Une erreur s\'est produite lors de la recherche de l\'utilisateur.');
    }
  };