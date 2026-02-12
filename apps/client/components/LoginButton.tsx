"use client";
import React, { useState, useEffect } from 'react';

const LoginButton = () => {
  const [user, setUser] = useState<{ github_username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'authenticated') {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/github';
  };

  const handleLogout = () => {
    fetch('/api/auth/logout')
      .then(() => {
        setUser(null);
        window.location.reload();
      })
      .catch(() => {});
  };

  if (loading) return null;

  if (user) {
    return (
      <div className="user-info">
        <span>Welcome, {user.github_username}</span>
        <button className="login-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <button className="login-button" onClick={handleLogin}>
      Login with GitHub
    </button>
  );
};

export default LoginButton;
