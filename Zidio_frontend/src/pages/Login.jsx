import React, { useState } from 'react';
import Login1 from '@/components/ui/login';
import axios from '../axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      const { user, token } = response.data;
      
      if (!user.isVerified) {
        setError('Please verify your email first');
        return;
      }

      dispatch(setUser({ user, token }));
      localStorage.setItem('token', token);
      
      // Navigate based on user role
      if (user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-900 text-white">
        <Login1 onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
}

export default Login;
