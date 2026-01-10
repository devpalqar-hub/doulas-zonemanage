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
import ScheduleMeetingPage from './pages/Meetings/scheduleMeetings/ScheduleMeetingPage';
import CheckAvailability from './pages/Schedules/CheckAvailability';
import JoinMeeting from './pages/Meetings/JoinMeeting';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={localStorage.getItem("token") ? <Navigate to ="/dashboard" replace/> : <Login />} />

        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path='/availability' element={
          <PrivateRoute>
            <MyAvailability />
          </PrivateRoute>
        } />

        <Route path='/doulas' element={
          <PrivateRoute>
            <ManageDoulas />
          </PrivateRoute>
        } />

        <Route path='/doulas/:id' element={
          <PrivateRoute>
            <ViewDoulaPage />
          </PrivateRoute>
        } />

        <Route path='/doulas/create' element={
          <PrivateRoute>
            <CreateDoula />
          </PrivateRoute>
        } />

        <Route path='/doulas/:doulaId/edit' element={
          <PrivateRoute>
            <EditDoula />
          </PrivateRoute>
        } />

        <Route path="/meetings" element={
          <PrivateRoute>
            <Meetings />
          </PrivateRoute>
        } />

        <Route path="meetings/:id" element={
          <PrivateRoute>
            <MeetingDetailsPage />
          </PrivateRoute>
        } />

        <Route path="/joinmeeting/:meetingId" element={
          <PrivateRoute>
            <JoinMeeting />
          </PrivateRoute>
        } />

        <Route path="meetings/:enquiryId/schedule" element={
          <PrivateRoute>
            <ScheduleMeetingPage />
          </PrivateRoute>
        } />

        <Route path="/bookings" element={
          <PrivateRoute>
            <Bookings />
          </PrivateRoute>
        } />

        <Route path="/bookings/create" element={
          <PrivateRoute>
            <CreateBooking />
          </PrivateRoute>
        } />

        <Route path="/schedules" element={
          <PrivateRoute>
            <Schedules />
          </PrivateRoute>
        } />

        <Route path="/schedules/check-availability" element={
          <PrivateRoute>
            <CheckAvailability />
          </PrivateRoute>
        } />

        <Route path="/testimonials" element={
          <PrivateRoute>
            <Testimonials />
          </PrivateRoute>
        } />

        <Route path="/testimonials/:id" element={
          <PrivateRoute>
            <TestimonialView />
          </PrivateRoute>
        } />     

      </Routes>
    </BrowserRouter>
  )
}

export default App
