import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './UsersPage.css';


export default function UsersPage() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    axios.get('/api/users/')
      .then(res => {
        setUsers(res.data.users);
      })
      .catch(e => {
        console.error(e);
      });
  }, []);


  let usersList = null;
  if (users && users.length) {
    usersList = (
      <ul>
        {users.map(user => {
          return <li key={user.id}><Link to={`/users/${user.id}`}>{user.name}</Link></li>;
        })}
      </ul>
    );
  }

  return (
    <div className='users'>
      {usersList}
    </div>
  );
}
