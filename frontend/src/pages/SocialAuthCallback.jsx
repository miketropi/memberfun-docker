import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function SocialAuthCallback() {
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    
    const user = {
      id: searchParams.get('id'),
      email: searchParams.get('email'),
      token: searchParams.get('token'),
      name: searchParams.get('name'),
    };

    setUser(user);
    localStorage.setItem('auth-token', user.token);

    navigate('/dashboard');

  }, []);

  return (
    <></>
  );
}