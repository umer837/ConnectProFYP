import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // 🛠️ Fixed: Added Routes import
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRequests from "./pages/AdminRequests";
import AdminProviders from "./pages/AdminProviders";
import AdminContacts from "./pages/AdminContacts";
import UserDashboard from "./pages/UserDashboard";
import NewWorkerDashboard from "./pages/NewWorkerDashboard";
import UserBookings from "./pages/UserBookings";
import UserProfile from "./pages/UserProfile";
import UserMessages from "./pages/UserMessages";
import WorkerProfile from "./pages/WorkerProfile";
import WorkerFeedbacks from "./pages/WorkerFeedbacks";
import UserRegistration from "./pages/UserRegistration";
import WorkerRegistration from "./pages/WorkerRegistration";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop /> {/* ✅ This ensures scroll resets on route change */}
          <div className="min-h-screen">
            <Routes>
              {/* Routes with Navigation */}
              <Route
                path="/"
                element={
                  <>
                    <Navigation />
                    <Home />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/contact"
                element={
                  <>
                    <Navigation />
                    <Contact />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/about"
                element={
                  <>
                    <Navigation />
                    <AboutUs />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/services"
                element={
                  <>
                    <Navigation />
                    <Services />
                    <Footer />
                  </>
                }
              />

              {/* Routes without Navigation */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/register/user" element={<UserRegistration />} />
              <Route path="/register/worker" element={<WorkerRegistration />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <AdminUsers />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <ProtectedAdminRoute>
                    <AdminRequests />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/providers"
                element={
                  <ProtectedAdminRoute>
                    <AdminProviders />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/contacts"
                element={
                  <ProtectedAdminRoute>
                    <AdminContacts />
                  </ProtectedAdminRoute>
                }
              />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/bookings" element={<UserBookings />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/user/messages" element={<UserMessages />} />
              <Route path="/worker/dashboard" element={<NewWorkerDashboard />} />
              <Route path="/worker/profile" element={<WorkerProfile />} />
              <Route path="/worker/feedbacks" element={<WorkerFeedbacks />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
