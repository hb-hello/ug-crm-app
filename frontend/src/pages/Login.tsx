import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useToastStore } from '../store/useToastStore';
import { useUserStore } from '../store/userStore';
import { signInWithGoogle } from '../services/firebase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setUser(user);
        // Wait a bit to ensure auth.currentUser is set
        await new Promise(resolve => setTimeout(resolve, 500));
        addToast('success', 'Login successful!');
        navigate('/students');
      }
    } catch (error) {
      addToast('error', 'Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header fixed height */}
      <header
        className={clsx(
          'w-full',
          'h-20',
          'bg-white',
          'shadow-sm',
          'flex',
          'items-center',
          'justify-center',
          'text-4xl',
          'font-bold',
          'text-gray-900',
          'flex-shrink-0'
        )}
      >
        Welcome to CRM
      </header>

      {/* Main content fills remaining space, centers button */}
      <main className="flex-grow flex justify-center items-center p-4">
        <button
          onClick={handleLogin}
          className={clsx(
            'px-6',
            'py-3',
            'bg-blue-600',
            'hover:bg-blue-700',
            'cursor-pointer',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
            'text-white',
            'font-semibold',
            'rounded-md',
            'shadow-md',
            'transition',
            'duration-150',
            'ease-in-out'
          )}
        >
          Sign in with Google
        </button>
      </main>
    </div>
  );
};

export default Login;
