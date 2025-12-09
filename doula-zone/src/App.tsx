import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/login'
import Dashboard from './pages/Dashboard/Dashboard';
import type React from 'react';
import MyAvailability from './pages/Availability/MyAvailability';
import ManageDoulas from './pages/Doulas/ManageDoula/ManageDoulas';
import CreateDoula from './pages/Doulas/CreateDoula/CreateDoula';
import Testimonials from './pages/Testimonials/Testimonials';
import TestimonialView from './pages/Testimonials/TestimonialView';

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

        <Route path='/doulas' element={
          <PrivaterRoute>
            <ManageDoulas />
          </PrivaterRoute>
        } />

        <Route path='/doulas/create' element={
          <PrivaterRoute>
            <CreateDoula />
          </PrivaterRoute>
        } />

        <Route path="/testimonials" element={
          <PrivaterRoute>
            <Testimonials />
          </PrivaterRoute>
        } />

        <Route path="/testimonials/:id" element={
          <PrivaterRoute>
            <TestimonialView />
          </PrivaterRoute>
        } />

        

      </Routes>
    </BrowserRouter>
  )
}

export default App
