
import React, {useEffect, useState} from 'react';

function Register() {
  return (
    <div className="register">
      <form method="POST" action="/api/register">
				<label>
          Name:
          <input type="text" name="name" />
        </label>
				<label>
          Email:
          <input type="email" name="email" />
        </label>
				<label>
          Password:
          <input type="password" name="password" />
        </label>
				<label>
          Confirm Password:
          <input type="password" name="confirmpassword" />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
