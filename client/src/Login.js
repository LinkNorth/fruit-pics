import React, {useEffect, useState} from 'react';

function Login() {
  return (
    <div className="login">
      <form method="POST" action="/api/login">
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
