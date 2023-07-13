import React ,{ useContext } from 'react'
import { Button, Card } from 'react-bootstrap'
import '../style/accueilStyle.css'
import { PostContext } from '../store/PostStore'
import { UserContext } from '../store/UserStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash} from '@fortawesome/free-solid-svg-icons';
import { ToastContext } from './ToastContext';

const Comments = ({ post, comment}) => {
    const postStore = useContext(PostContext)
    const userStore = useContext(UserContext)
    const { showToast } = useContext(ToastContext);
    return (
      <Card className='Comments m-2 p-2'>
        <p>{comment.content}</p>
        <div className="footerComment">
          <Card.Text>{comment.username}</Card.Text>
          <Card.Text>{postStore.formatDate(comment.date)}</Card.Text>
          {comment.username === userStore.user.username && (
            <Button
              variant="danger"
              size="sm"
              className="delete-comment-button"
              onClick={() => {postStore.deleteComment(post, comment); showToast('Commentaire Supprimé')}}
            >
              <FontAwesomeIcon icon={faTrash} style={{color: "#ffffff",}} />
            </Button>
          )}
        </div>
      </Card>
    );
  };
  
  export default Comments;
  