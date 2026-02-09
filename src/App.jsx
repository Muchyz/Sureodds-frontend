import { Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import ProtectedRoute from "./ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LiveMatches from "./pages/Navbarpages/LiveMatches";
//learn more
import Learn from "./pages/Navbarpages/Learn";
import VipAccessDenied from "./pages/Navbarpages/VipAccessDenied"

// Protected pages
import Features from "./pages/Navbarpages/Features";
import Pricing from "./pages/Navbarpages/Pricing";
import About from "./pages/Navbarpages/About";
import Contact from "./pages/Navbarpages/Contact";
import Matches from "./pages/Navbarpages/Matches";
import AdminFeatures from "./pages/AdminFeatures";
import Admin from './Admin';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/live" element={<LiveMatches />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 PROTECTED */}
        <Route
          path="/features"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pricing"
          element={
          
              <Pricing />
            
          }
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={
              <Contact />
          }
        />

        <Route
          path="/matches"
          element={
              <Matches />
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminFeatures />
            </ProtectedRoute>
          }
        />
        
        <Route path="/learn" 
        element={<Learn />} 
        />
        
        <Route path="/vip-access-denied" element={<VipAccessDenied />} />

<Route path="/admin" element={<Admin />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;