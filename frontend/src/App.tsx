import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ToastManager from './components/common/ToastManager';
import Login from './pages/Login';
import StudentDirectory from './pages/StudentDirectory';
import { onAuthStateChanged } from './services/firebase';
import { useUserStore } from './store/userStore';
import './App.css'

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
        <Route path="/students" element={<StudentDirectory />} />
      </Routes>
      <ToastManager />
    </>
  );
}

export default App;