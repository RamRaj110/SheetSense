import React, { useState } from 'react';
import Signin1 from '../components/ui/signup';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/auth/register', {
        name: credentials.username,
        email: credentials.email,
        password: credentials.password
      });

      if (response.data) {
        navigate('/user/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Signin1 
        onSubmit={handleSignUp}
        error={error}
        isLoading={loading} 
      />
    </div>
  );
}

export default SignUp;
