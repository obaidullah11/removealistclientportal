import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


// Layout Components
import Navbar from './components/layout/Navbar'

// Landing Page Components (existing)
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Partners from './components/Partners'
import Sustainability from './components/Sustainability'
import CTA from './components/CTA'
import Footer from './components/Footer'

// Auth Pages
import Login from './pages/auth/Login'

// Moving Platform Pages
import CreateMove from './pages/move/CreateMove'
import Timeline from './pages/move/Timeline'
import Checklist from './pages/move/Checklist'
import Tips from './pages/move/Tips'
import Inventory from './pages/inventory/Inventory'

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Partners />
      <Sustainability />
      <CTA />
      <Footer />
    </div>
  )
}

// Layout wrapper for authenticated pages
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          
          {/* Protected Routes with App Layout */}
          <Route path="/move" element={
            <AppLayout>
              <CreateMove />
            </AppLayout>
          } />
          <Route path="/timeline" element={
            <AppLayout>
              <Timeline />
            </AppLayout>
          } />
          <Route path="/checklist" element={
            <AppLayout>
              <Checklist />
            </AppLayout>
          } />
          <Route path="/tips" element={
            <AppLayout>
              <Tips />
            </AppLayout>
          } />
          <Route path="/inventory" element={
            <AppLayout>
              <Inventory />
            </AppLayout>
          } />
          
          {/* Redirect unknown routes to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App