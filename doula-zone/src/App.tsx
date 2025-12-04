import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/login'
import Dashboard from './pages/Dashboard/Dashboard';
import type React from 'react';
import MyAvailability from './pages/Availability/MyAvailability';

function PrivaterRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />

        <Route path='/dashboard' element={
          <PrivaterRoute>
            <Dashboard />
          </PrivaterRoute>
        } />

        <Route path='/availability' element={
          <PrivaterRoute>
            <MyAvailability />
          </PrivaterRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
