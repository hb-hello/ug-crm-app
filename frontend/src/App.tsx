import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ToastManager from './components/common/ToastManager';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import { onAuthStateChanged } from './services/firebase';
import { useUserStore } from './store/userStore';
import './App.css'
import { Spinner, Center } from '@chakra-ui/react';

import { MainLayout } from './components/layout/MainLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useUserStore();
  const location = useLocation();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        clearUser();
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, clearUser]);

  return (
    <>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes wrapped in Layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/tasks" element={<Students />} /> {/* Placeholder */}
          <Route path="/dashboard" element={<Students />} /> {/* Placeholder */}
          <Route path="/" element={<Navigate to="/students" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/students" replace />} />
      </Routes>
      <ToastManager />
    </>
  );
}

export default App;