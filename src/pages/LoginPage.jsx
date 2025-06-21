import React from 'react';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return(
    <div className="login_container">
      <div className="left_container">
        <h1>Welcome back</h1>
        <p> Please enter your details</p>
        <LoginForm/>
      </div>

      <div className='right_container'>
        <div className='image_wrapper'>
          <div className="bg_shape"></div>
          <img src="/assets/dog-lab.jpg"/>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;