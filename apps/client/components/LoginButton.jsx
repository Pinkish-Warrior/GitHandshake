"use client";
import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
    // Redirect to the backend auth endpoint
    window.location.href = 'http://localhost:3001/api/auth/github';
  };

  return (
    <button className="login-button" onClick={handleLogin}>
      Login with GitHub
    </button>
  );
};

export default LoginButton;