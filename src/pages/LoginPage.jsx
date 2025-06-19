import React from 'react';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return(
    <div className="login_container">
      <h1>Login</h1>
      <LoginForm/>
    </div>
  );
};

export default LoginPage;