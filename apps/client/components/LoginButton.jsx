"use client";
import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
    // Placeholder for GitHub authentication logic
    alert('Logging in with GitHub...');
  };

  return (
    <button className="login-button" onClick={handleLogin}>
      Login with GitHub
    </button>
  );
};

export default LoginButton;
