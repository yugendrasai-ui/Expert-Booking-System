import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import ExpertDetail from "./pages/ExpertDetail";
import BookExpert from "./pages/BookExpert";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpertRegister from "./pages/ExpertRegister";
import ExpertDashboard from "./pages/ExpertDashboard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/expert-register" element={<ExpertRegister />} />
                  <Route path="/experts/:id" element={<ExpertDetail />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/book/:expertId" element={<BookExpert />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                  </Route>

                  {/* Admin/Expert Routes */}
                  <Route element={<ProtectedRoute allowedRoles={["expert", "admin"]} />}>
                    <Route path="/expert-dashboard" element={<ExpertDashboard />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
              <Sonner />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
