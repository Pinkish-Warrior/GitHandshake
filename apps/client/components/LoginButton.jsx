"use client";
import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log("Attempting to redirect to:", `${apiUrl}/api/auth/github`);
    // Redirect to the backend auth endpoint
    window.location.href = `${apiUrl}/api/auth/github`;
  };

  return (
    <button className="login-button" onClick={handleLogin}>
      Login with GitHub
    </button>
  );
};

export default LoginButton;