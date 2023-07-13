import { makeAutoObservable, runInAction } from 'mobx';
import { createContext } from 'react';
import axios from 'axios'

class PostStore {
    posts = []
    postsPerso = []
   constructor(){
     axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
       makeAutoObservable(this)
       this.getAllPosts()
   }

   
   getAllPosts() {
    axios
      .get('http://localhost:3000/allPosts')
      .then((resp) => {
        runInAction(() => {
          this.posts = resp.data;
        });
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des posts :', error);
      });
  }

 async getAllPostsByUser(username) {
  try {
    const resp = await axios.post('http://localhost:3000/allPostsByUsername', {
      username,
    });
    runInAction(() => {
      this.postsPerso = resp.data;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des posts :', error);
  }
}

async handleDeletePost(articleId) {
  console.log(articleId);
  try {
    const resp = await axios.post(`http://localhost:3000/posts/${articleId}`);
    runInAction(() => {
      this.postsPerso = this.postsPerso.filter((article) => article._id !== articleId);
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article :", error);
  }
}

async handleUpdate(currentPost) {
  const updatedArticle = {
    title: currentPost.title,
    content: currentPost.content,
  };

  try {
    const resp = await axios.post(
      `http://localhost:3000/updatePost/${currentPost._id}`,
      updatedArticle
    );
    runInAction(() => {
      const updatedArticles = this.postsPerso.map((article) => {
        if (article._id === currentPost._id) {
          return {
            ...article,
            title: currentPost.title,
            content: currentPost.content,
          };
        }
        return article;
      });
      this.postsPerso = updatedArticles;
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article :", error);
  }
}


async addComment(selectedPostId, commentContent, username) {
  try {
    const resp = await axios.post(`http://localhost:3000/posts/${selectedPostId}/comments`, {
      username: username,
      comment: commentContent,
    });
    runInAction(() => {
      const updatedPosts = this.posts.map((article) => {
        if (article._id === selectedPostId) {
          return resp.data.post;
        }
        return article;
      });
      this.posts = [...updatedPosts];
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
  }
}

deleteComment(article, comment) {
  axios
    .post(
      `http://localhost:3000/posts/${article._id}/comments/${comment._id}`,
    )
    .then((resp) => {
      runInAction(() => {
        console.log('Commentaire supprimé :', resp.data);
        const updatedArticles = this.posts.map((a) => {
          if (a._id === article._id) {
            const updatedComments = a.comments.filter(
              (c) => c._id !== comment._id,
            );
            return {
              ...a,
              comments: updatedComments,
            };
          }
          return a;
        });
        this.posts = [...updatedArticles];
      });
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression du commentaire :', error);
    });
}


handleLike(postId, username) {
  console.log(postId);
  axios
    .post(`http://localhost:3000/posts/${postId}/likes`, { username: username })
    .then((resp) => {
      runInAction(() => {
        console.log('Post aimé :', resp.data);
        const updatedPosts = this.posts.map((article) => {
          if (article._id === postId) {
            return resp.data.post;
          }
          return article;
        });
        this.posts = [...updatedPosts];
      });
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout de mention J'aime :", error);
    });
}


handleUnLike(postId, username) {
  console.log(postId);
  axios
    .post(`http://localhost:3000/posts/${postId}/unLikes`, { username: username })
    .then((resp) => {
      runInAction(() => {
        console.log('Post unlike :', resp.data);
        const updatedPosts = this.posts.map((article) => {
          if (article._id === postId) {
            return resp.data.post;
          }
          return article;
        });
        this.posts = [...updatedPosts];
      });
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout de mention J'aime :", error);
    });
}


newPost(title, content, username, date){
  axios
  .post('http://localhost:3000/newPost', { title, content, username, date })
  .then((resp) => {
    console.log(resp);
  })
  .catch((error) => {
    console.error('Erreur lors de la création du post :', error)
  })
}

 formatDate(dateString){
   const options = {
     hour: 'numeric',
     minute: 'numeric',
     day: '2-digit',
     month: '2-digit',
     year: '2-digit',
   }
   const date = new Date(dateString)
   return date.toLocaleDateString('fr-FR', options)
 }


}


const postStore = new PostStore();

const PostContext = createContext(postStore);

export { postStore, PostContext };
