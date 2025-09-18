import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider, useToast } from "./components/ui/toast";
import { setGlobalToast } from "./lib/snackbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout Components
import Navbar from "./components/layout/Navbar";

// Landing Page Components
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Discounts from "./components/Discounts";
import PartnerSection from "./components/PartnerSection";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPasswordConfirm from "./pages/auth/ResetPasswordConfirm";
import ChangePassword from "./pages/auth/ChangePassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Legal Pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";

// Moving Platform Pages
import CreateMove from "./pages/move/CreateMove";
import Timeline from "./pages/move/Timeline";
import Checklist from "./pages/move/Checklist";
import Tips from "./pages/move/Tips";
import Inventory from "./pages/inventory/Inventory";
import MyMove from "./pages/move/MyMove";
import MoveDashboard from "./pages/move/MoveDashboard";
import BookTime from "./pages/move/BookTime";
import Profile from "./pages/Profile";
import Partners from "./pages/Partners";
import UserMoves from "./pages/move/UserMoves";
import EditMove from "./pages/move/EditMove";
import MyBookings from "./pages/move/MyBookings";
import Pricing from "./pages/Pricing";
import TaskManager from "./pages/tasks/TaskManager";
import ServiceBooking from "./pages/services/ServiceBooking";

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PartnerSection />
      <Discounts />

      <Footer />
    </div>
  );
}

// Layout wrapper for authenticated pages - maintains landing page style
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-8">{children}</main>
      <Footer />
    </div>
  );
}

// Toast setup component
function ToastSetup() {
  const { toast } = useToast();

  useEffect(() => {
    setGlobalToast(toast);
  }, [toast]);

  return null;
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <ToastSetup />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/reset-password/confirm/:token"
                element={<ResetPasswordConfirm />}
              />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Protected Routes with App Layout */}
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ChangePassword />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/move"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CreateMove />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MyBookings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-move"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MyMove />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-moves"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <UserMoves />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/move/dashboard/:moveId"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MoveDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/move/edit/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EditMove />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book-time"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <BookTime />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timeline"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Timeline />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checklist"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Checklist />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tips"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Tips />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Inventory />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TaskManager />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ServiceBooking />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;