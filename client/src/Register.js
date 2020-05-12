
import React, {useEffect, useState} from 'react';

function Register() {
  return (
    <div class="register">
      <form method="POST" action="/api/register">
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="password" name="password" />
        <input type="password" name="confirmpassword" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
