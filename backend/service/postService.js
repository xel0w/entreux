const Post = require('../models/Post');

exports.createPost = async (title, content, username, date) => {
    const post = new Post({
        title, content, username, date
    });
    try{
        const newPost = await post.save();
        console.log(newPost);
        return null
    }catch (error){
        console.error(error);
        throw new Error ('Une erreur s\'est produite lors de l\'ajout du post.');
    }
}

exports.getAllPosts = async () => {
  try {
    const posts = await Post.find().sort({date: -1});
    return posts;
  } catch (error) {
    console.error(error);
    throw new Error('Une erreur s\'est produite lors de la récupération des posts.');
  }
};

exports.getAllPostsByUsername = async (username) => {
    try {
      const posts = await Post.find({ username });
      return posts;
    } catch (error) {
      console.error(error);
      throw new Error('Une erreur s\'est produite lors de la récupération des posts.');
    }
  };

  exports.deletePostById = async (id) => {
    try {
      const post = await Post.findById(id);
      if (!post) {
        throw new Error('L\'article n\'existe pas.');
      }
      await post.deleteOne();
    } catch (error) {
      console.error(error);
      throw new Error('Une erreur s\'est produite lors de la suppression du post.');
    }
  };
  
  exports.updatePostById = async (id, title, content) => {
    try {
      const post = await Post.findById(id);
      if (!post) {
        throw new Error('L\'article n\'existe pas.');
      }
      post.title = title;
      post.content = content;
      await post.save();
    } catch (error) {
      console.error(error);
      throw new Error('Une erreur s\'est produite lors de la mise à jour du post.');
    }
  };

  exports.addCommentToPost = async (postId, username, content) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Le post n'existe pas.");
      }
  
      const comment = {
        username: username,
        content: content
      };
  
      post.comments.push(comment);
      await Post.updateOne({ _id: postId }, { comments: post.comments });
      return post;
    } catch (error) {
      console.error(error);
      throw new Error("Une erreur s'est produite lors de l'ajout du commentaire.");
    }
  };

  exports.deleteComment = async (postId, commentId) => {
    console.log(postId, commentId);
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('L\'article n\'existe pas.');
      }
  
      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
      if (commentIndex === -1) {
        throw new Error('Le commentaire n\'existe pas.');
      }
  
      post.comments.splice(commentIndex, 1);
      await post.save();
  
      return post;
    } catch (error) {
      console.error(error);
      throw new Error('Une erreur s\'est produite lors de la suppression du commentaire.');
    }
  };
  
  exports.addlikeToPost = async (postId, username) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Le post n'existe pas.");
      }
  
      const like = {
        username: username
      };
  
      post.likes.push(like);
      await Post.updateOne({ _id: postId }, { likes: post.likes });
      return post;
    } catch (error) {
      console.error(error);
      throw new Error("Une erreur s'est produite lors de l'ajout du like.");
    }
  };

  exports.removelikeToPost = async (postId, username) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Le post n'existe pas.");
      }
  
      post.likes = post.likes.filter((like) => like.username !== username);
      await post.save();
  
      return post;
    } catch (error) {
      console.error(error);
      throw new Error("Une erreur s'est produite lors de la suppression du like.");
    }
  };
  
  