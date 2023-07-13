const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {signIn, signUp, renewToken} = require('./service/authService');
const {changeUsername, changePassword, changeProfilePhoto} = require('./service/userService')
const {createPost, getAllPosts, getAllPostsByUsername, deletePostById, updatePostById, addCommentToPost, deleteComment, addlikeToPost, removelikeToPost} = require('./service/postService')
const { isUserLogged } = require('./middlewares/middlewares');
const sanitize = require ('./sanitize/mongoSanitize')
const upload = require('./multer/multer')

const connectDB = require('./mongo/mongoose');


connectDB();
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Bienvenue sur votre serveur Express !');
});

//////////////////////// Connexion /////////////////////////////////


app.post('/signIn', async (req, res) => {
    console.log(req.body);
    const { username, password } = sanitize(req.body);

    try {
      const result = await signIn(username, password);

      if (result && result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.send({ message: 'Utilisateur connecté', token: result.token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la connexion.' });
    }
});

//////////////////////// Nouveau token /////////////////////////////////


app.get('/renew/:id', isUserLogged, async (req, res) => {
    const { id } = sanitize(req.params);
   try {
      const result = await renewToken(id);
      res.send({ token: result.token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la connexion.' });
    }
});


//////////////////////// Inscription /////////////////////////////////



app.post('/signUp', async (req, res) => {
    console.log(req.body);
    const { username, password } = sanitize(req.body);
    try {
      await signUp(username, password);
      res.send('Nouvel utilisateur créé');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'inscription.' });
    }
});


////////////////////////Creation Post///////////////////////////////


app.post('/newPost', isUserLogged, async (req, res) => {
  console.log(req.body);
  const { title, content, username, date } = sanitize(req.body);
  try {
    await createPost(title, content, username, date);
    res.send('Nouveau post créé');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la création du post.' });
  }
});


////////////////////////recuperation tous les Posts///////////////////////////////

app.get('/allPosts', isUserLogged, async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des posts.' });
  }
});



////////////////////////recuperation tous les Posts d'un utilisateur///////////////////////////////

app.post('/allPostsByUsername', isUserLogged, async (req, res) => {
  const { username} = sanitize(req.body);
  try {
    let posts = await getAllPostsByUsername(username);
    posts = posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des posts.' });
  }
});


////////////////////////suppression d'un post///////////////////////////////

app.post('/posts/:id', isUserLogged,async (req, res) => {
  const { id } = sanitize(req.params);
  try {
    await deletePostById(id);
    res.status(200).json({ message: 'Article supprimé avec succès.' });
    console.log('TRY')
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la suppression du post.' });
  }
});


////////////////////////modification d'un post///////////////////////////////

app.post('/updatePost/:id',isUserLogged, async (req, res) => {
  const { id } = req.params;
  const { title, content} = sanitize(req.body);
  try {
    await updatePostById(id, title, content);
    res.status(200).json({ message: 'Article mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la mise à jour du post.' });
  }
});


////////////////////////Ajout d'un commentaire///////////////////////////////

app.post('/posts/:id/comments',isUserLogged, async (req, res) => {
  const {id} = req.params;
  const {comment, username} = sanitize(req.body);
  console.log("ID= ",id);
  try{
    const post = await addCommentToPost(id, username, comment);
    res.status(200).send({post});

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'ajout du commentaire.' });
  }

});


////////////////////////Suppression d'un commentaire///////////////////////////////

app.post('/posts/:id/comments/:commentId',isUserLogged, async (req, res) => {
  const {id, commentId} = req.params;
  console.log('index',id, commentId);
  try{
    await deleteComment(id, commentId);
    res.status(200).json({ message: 'Commentaire supprimé avec succès.' });
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la suppression du commentaire.' });
  }

});


////////////////////////Ajout d'un like///////////////////////////////

app.post('/posts/:id/likes',isUserLogged, async (req, res) => {
  const {id} = req.params;
  const {username} = sanitize(req.body);
  try{
    const post = await addlikeToPost(id, username);
    res.status(200).send({post});
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'ajout du commentaire.' });
  }

});


////////////////////////Retrait d'un like///////////////////////////////


app.post('/posts/:id/unLikes',isUserLogged, async (req, res) => {
  const {id} = req.params;
  const {username} = sanitize(req.body);
  try{
    const post = await removelikeToPost(id, username);
    res.status(200).send({post});
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'ajout du commentaire.' });
  }

});


////////////////////////modification d'un utlilisateur///////////////////////////////

app.post('/updateUser/:id', isUserLogged, upload.single('profilePhoto'), async (req, res) => {
  const { id } = req.params;
  const { username, password } = sanitize(req.body);
  console.log(username, password);

  if (!username && !password && !req.file) {
    return res.status(400).json({ error: 'Aucun username, password ou photo fourni.' });
  }
  try {
    if (req.file) {
      const profilePhotoPath = req.file.path;
      await changeProfilePhoto(id, profilePhotoPath)
    }
    if (username) {
      await changeUsername(id, username);
      const result = await renewToken(username);
      console.log('RESULT', result);
      res.send({ token: result.token });
    }
    if (password) {
      await changePassword(id, password);
      res.status(200).json({ message: 'Password mis à jour avec succès.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la mise à jour de l\'utilisateur.' });
  }
});



const port = 3000;
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
