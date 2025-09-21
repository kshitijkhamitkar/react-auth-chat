import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import ChatWindow from './components/Chat/ChatWindow';
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuth } from './store/authSlice';
import './styles/globals.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/signin" 
            element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <SignIn />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <SignUp />
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatWindow />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/chat" : "/signin"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;