import React, {useEffect, useState} from 'react';

function Login() {
  return (
    <div className="login">
      <form method="POST" action="/api/login">
        <input type="email" name="email" />
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
