import React, { useEffect } from 'react';
import SignInForm from '@/components/Auth/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      login(data.payload);
      console.log('Login successful, received data:', data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  };

  return <SignInForm onLogin={handleLogin} />;
};

export default SignIn;