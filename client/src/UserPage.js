import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './UserPage.css';
import ImageContainer from './ImageContainer';

function getUser(userId) {
  return axios.get(`/api/users/${userId}`)
    .then(res => {
      return res.data.user;
    });
}


function UserInfo({user, onFollow}) {
  if (!user) return null;

  return <div className="user-info">
    <h2>{user.name}</h2>
    <button onClick={() => onFollow()}>{user.doesFollow ? 'Unfollow' : 'Follow'}</button> 
  </div>;
}

export default function UserPage(props) {
  const [user, setUser] = useState(null);
  let userId = props.match.params.id || 'self';

  useEffect(() => {
    getUser(userId)
      .then(user => {
        setUser(user);
      });
  }, [userId]);

  function onFollow() {
    let p;
    if (user.doesFollow) {
      p = axios.delete(`/api/users/${userId}/follow`)
    } else {
      p = axios.post(`/api/users/${userId}/follow`)
    }

    p.then(() => {
      return getUser(userId);
    })
    .then(user => {
      setUser(user);
    });
  }

  return <div className="user-page">
    <UserInfo user={user} onFollow={onFollow} />
    <ImageContainer noImagesText="User has no images" imageUrl={`/api/users/${userId}/images`} />
  </div>
}
