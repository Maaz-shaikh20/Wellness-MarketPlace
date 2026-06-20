import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";

/* ========= AUTH & USER ========= */
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import ViewProfile from "./pages/ViewProfile";
import MySessions from "./pages/MySessions";
import BookTherapy from "./pages/BookTherapy";
import BookSession from "./pages/BookSession";
import Products from "./pages/Products";
import Activity from "./pages/Activity";
import ProductDetail from "./pages/ProductDetail";
import AiRecommendation from "./pages/AiRecommendation";
import Notifications from "./pages/Notifications";
import Community from "./pages/Community";

/* ========= PAYMENT ========= */
import CheckoutPage from "./pages/payment/CheckoutPage";
import PaymentMethodPage from "./pages/payment/PaymentMethodPage";
import PaymentResultPage from "./pages/payment/PaymentResultPage";

/* ========= ADMIN ========= */
import AdminDashboard from "./pages/AdminDashboard";

/* ========= PRACTITIONER ========= */
import PractitionerHome from "./pages/PractitionerHome";
import ManageTherapies from "./pages/ManageTherapies";
import CreateTherapy from "./pages/CreateTherapy";
import EditTherapy from "./pages/EditTherapy";
import PractitionerSessions from "./pages/PractitionerSessions";
import PractitionerCommunity from "./pages/PractitionerCommunity";
import PractitionerProfile from "./pages/PractitionerProfile";

/* ========= PRODUCT MANAGEMENT ========= */
import ManageProduct from "./pages/ManageProduct";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";

/* ========= ROUTE GUARDS ========= */
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import PractitionerRoute from "./routes/PractitionerRoute";
import ScrollToTop from "./routes/ScrollToTop";

/* ========= 404 PAGE ========= */
function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-900 px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl">
          🌿
        </div>
        <h1 className="text-8xl font-black tracking-tighter text-slate-900 mb-4">404</h1>
        <p className="text-slate-500 font-medium text-lg mb-8">
          This page doesn&apos;t exist in your wellness journey.
        </p>
        <a
          href="/home"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

/* ========= ANIMATED ROUTES WRAPPER ========= */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
          {/* ========= ROOT ========= */}
          <Route path="/" element={<LandingPage />} />

          {/* ========= PUBLIC ========= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ========= USER (PROTECTED) ========= */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
          <Route path="/ai-recommendation" element={<PrivateRoute><AiRecommendation /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />
          <Route path="/my-sessions" element={<PrivateRoute><MySessions /></PrivateRoute>} />
          <Route path="/book-therapy" element={<PrivateRoute><BookTherapy /></PrivateRoute>} />
          <Route path="/book-session/:id" element={<PrivateRoute><BookSession /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><ViewProfile /></PrivateRoute>} />

          {/* ========= PAYMENT ========= */}
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/payment-method" element={<PrivateRoute><PaymentMethodPage /></PrivateRoute>} />
          <Route path="/payment-result" element={<PrivateRoute><PaymentResultPage /></PrivateRoute>} />

          {/* ========= ADMIN ========= */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* ========= PRACTITIONER ========= */}
          <Route path="/practitioner/home" element={<PractitionerRoute><PractitionerHome /></PractitionerRoute>} />
          <Route path="/practitioner/profile" element={<PractitionerRoute><PractitionerProfile /></PractitionerRoute>} />

          {/* Therapies */}
          <Route path="/practitioner/therapies" element={<PractitionerRoute><ManageTherapies /></PractitionerRoute>} />
          <Route path="/practitioner/therapies/create" element={<PractitionerRoute><CreateTherapy /></PractitionerRoute>} />
          <Route path="/practitioner/therapies/edit/:id" element={<PractitionerRoute><EditTherapy /></PractitionerRoute>} />

          {/* Sessions */}
          <Route path="/practitioner/sessions" element={<PractitionerRoute><PractitionerSessions /></PractitionerRoute>} />

          {/* Community */}
          <Route path="/practitioner/community" element={<PractitionerRoute><PractitionerCommunity /></PractitionerRoute>} />

          {/* Products */}
          <Route path="/practitioner/products" element={<PractitionerRoute><ManageProduct /></PractitionerRoute>} />
          <Route path="/practitioner/products/create" element={<PractitionerRoute><CreateProduct /></PractitionerRoute>} />
          <Route path="/practitioner/products/edit/:id" element={<PractitionerRoute><EditProduct /></PractitionerRoute>} />

          {/* ========= 404 FALLBACK ========= */}
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <AnimatedRoutes />
      </Router>
    </CartProvider>
  );
}