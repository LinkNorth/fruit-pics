import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './modal.css';

function Modal({children, onCloseModal}) {
  return ReactDOM.createPortal(
    <>
      <div className='modal'>{children}</div>
      <div onClick={onCloseModal} className='modal-backdrop'></div>
    </>, 
    document.body);
}

function Comment({comment}) {
  let date = moment(comment.created_at).format('YYYY-MM-DD HH:mm');
  return <div className='comment'>
    <p>
      <Link to={`/users/${comment.user_id}`}>{comment.user_name}</Link> <i>{date}</i> - {comment.comment}
    </p>
  </div>
}

function ImageComments({comments, onNewComment}) {
  let [comment, setComment] = useState('');
  function onCommentChange(e) {
    setComment(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    onNewComment(comment);
    setComment('');
  }

  let commentsElements = null;
  if (comments && comments.length) {
    commentsElements = comments.map(comment => {
      return <Comment comment={comment} key={comment.id} />;
    });
  }

  return <div className='comments-container'>
    <div className='comments'>
      {commentsElements}
    </div>
    <form onSubmit={onSubmit}>  
      <textarea onChange={onCommentChange} value={comment} name="comment"></textarea>
      <button type="submit">Comment</button>
    </form>
  </div>
}

export default function ImageModal({imageId, onCloseModal}) {
  let [data, setData] = useState({});
  function getData() {
    axios.get(`/api/images/${imageId}`)
      .then(res => {
        setData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    function onKeyUp(e) {
      if (e.keyCode === 27) {
        onCloseModal();
      }
    }
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []); 

  let createdAt = null;
  if (data.created_at) {
    createdAt = moment(data.created_at).format('YYYY-MM-DD HH:mm');
  }

  function onNewComment(newComment) {
    axios.post(`/api/images/${imageId}/comment`, {comment: newComment})
      .then(() => {
        getData();
      });
  }

  function onLike() {
    axios.post(`/api/images/${imageId}/like`,)
      .then(() => {
        getData();
      });
  }

  return <Modal onCloseModal={onCloseModal}>
    <div className='image-modal'>
      <button className='close-button' onClick={onCloseModal}>X</button>
      <h2>{data.title || 'Untitled'}</h2>
      <p>{createdAt}</p>
      <p>{data.description}</p>
      <p>Likes: {data.likes || 0}<button onClick={onLike}>Like</button></p>
      <img src={`/api/images/${imageId}/raw`} />
      <ImageComments comments={data.comments} onNewComment={onNewComment} />
    </div>
  </Modal>
}
