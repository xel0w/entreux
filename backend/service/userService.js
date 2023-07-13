const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

exports.getUserByUsername = (username) => {
  return User.findOne({ username });
};

exports.getUserById = (id) => {
  return User.findOne({ id });
};

exports.createUser = (user) => {
  return User.create({ ...user });
};

exports.changeUsername = async (userId, newUsername) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    await Post.updateMany(
      { username: user.username },
      { username: newUsername }
    );
    user.username = newUsername;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Échec du changement de l'username");
  }
};

exports.changePassword = async (userId, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Échec du changement du mot de passe");
  }
};

exports.changeProfilePhoto = async (userId, newProfilePhoto) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    user.profilePhoto = newProfilePhoto;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Échec du changement de la photo de profil");
  }
};
