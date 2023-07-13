import { Button, Card } from 'react-bootstrap';
import React, { useContext } from 'react';
import { UserContext } from '../store/UserStore';
import { PostContext } from '../store/PostStore';
import Comments from './Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import '../style/accueilStyle.css'
import { observer } from 'mobx-react'

const Posts = observer(({ post, openModal }) => {
  const userStore = useContext(UserContext);
  const postStore = useContext(PostContext);

  const handleLike = () => {
    const { username } = userStore.user;

    if (post.likes.find(like => like.username === userStore.user.username)) {
      postStore.handleUnLike(post._id, username);
    } else {
      postStore.handleLike(post._id, username);
    }
  };

  return (
    <div className="col-md-10" key={post._id}>
      <Card className="mb-4 p-2">
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Text>{post.content}</Card.Text>
          <div className="bottomPost">
            <Card.Text>{post.username}</Card.Text>
            <Card.Text>{postStore.formatDate(post.date)}</Card.Text>
          </div>
          <Card className="p-2  bg-light">
            <h6>Commentaires:</h6>
            {post.comments.map((comment) => (
              <Comments
                post={post}
                comment={comment}
                userStore={userStore}
                key={comment._id}
              />
            ))}
            <div className="buttonsComment">
              <Button
                variant="primary"
                onClick={() => openModal(post._id)}
                className="btnComment"
              >
                <FontAwesomeIcon icon={faComment} style={{color: "#3b4dd8",}} />
              </Button>
              {!post.username.includes(userStore.user.username) ? (
              <Button
                onClick={handleLike}
                className="btnComment"
              >
                {post.likes.find(like => like.username === userStore.user.username) ? (<FontAwesomeIcon icon={faHeart} style={{color: "#ff1900",}} />) : (<FontAwesomeIcon icon={faHeart} style={{color: "#000",}} />)}
              </Button>) : ""}
            </div>
            <Card.Text>{post.likes.length} J'aime </Card.Text>
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
});

export default Posts;
