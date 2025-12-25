import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/login'
import Dashboard from './pages/Dashboard/Dashboard';
import type React from 'react';
import MyAvailability from './pages/Availability/MyAvailability';
import ManageDoulas from './pages/Doulas/ManageDoula/ManageDoulas';
import CreateDoula from './pages/Doulas/CreateDoula/CreateDoula';
import Bookings from './pages/Bookings/Bookings';
import Testimonials from './pages/Testimonials/Testimonials';
import TestimonialView from './pages/Testimonials/TestimonialView';
import Meetings from './pages/Meetings/Meetings';
import Schedules from './pages/Schedules/Schedules';
import ViewDoulaPage from './pages/Doulas/ViewDoula';
import MeetingDetailsPage from './pages/Meetings/MeetingDetails';
import CreateBooking from './pages/Bookings/CreateBooking';
import EditDoula from './pages/EditDoula/EditDoula';

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

        <Route path='/doulas/:id' element={
          <PrivaterRoute>
            <ViewDoulaPage />
          </PrivaterRoute>
        } />

        <Route path='/doulas/create' element={
          <PrivaterRoute>
            <CreateDoula />
          </PrivaterRoute>
        } />

        <Route path='/doulas/:doulaId/edit' element={
          <PrivaterRoute>
            <EditDoula />
          </PrivaterRoute>
        } />

        <Route path="meetings" element={
          <PrivaterRoute>
            <Meetings />
          </PrivaterRoute>
        } />

        <Route path="meetings/:id" element={
          <PrivaterRoute>
            <MeetingDetailsPage />
          </PrivaterRoute>
        } />

        <Route path="/bookings" element={
          <PrivaterRoute>
            <Bookings />
          </PrivaterRoute>
        } />

        <Route path="/bookings/create" element={
          <PrivaterRoute>
            <CreateBooking />
          </PrivaterRoute>
        } />

        <Route path="/schedules" element={
          <PrivaterRoute>
            <Schedules />
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
