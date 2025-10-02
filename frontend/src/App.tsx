import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToastManager from './components/common/ToastManager';
import Login from './pages/Login';
import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
        <ToastManager />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;