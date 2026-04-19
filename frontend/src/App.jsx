import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

/* ========= AUTH & USER ========= */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
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


/* 🔥 PRODUCT FILE NAMES (FIXED) */
import ManageProduct from "./pages/ManageProduct";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";

/* ========= ROUTE GUARDS ========= */
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import PractitionerRoute from "./routes/PractitionerRoute";

/* ========= ROUTE LOGGER ========= */
function RouteLogger() {
  const location = useLocation();
  useEffect(() => {
    console.log("📍 Route changed to:", location.pathname);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <Router>
      <RouteLogger />

      <Routes>
        {/* ========= ROOT ========= */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ========= PUBLIC ========= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔥 MODIFIED: Product Detail is now PUBLIC and uses dynamic :id.
            This allows users to see the product even if they aren't logged in.
        */}
        <Route path="/product/:id" element={<ProductDetail />} />

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
        <Route
          path="/practitioner/home"
          element={<PractitionerRoute><PractitionerHome /></PractitionerRoute>}
        />
        
        <Route
          path="/practitioner/profile"
          element={
          <PractitionerRoute>
          <PractitionerProfile />
          </PractitionerRoute>}
        />


        {/* Therapies */}
        <Route
          path="/practitioner/therapies"
          element={<PractitionerRoute><ManageTherapies /></PractitionerRoute>}
        />
        <Route
          path="/practitioner/therapies/create"
          element={<PractitionerRoute><CreateTherapy /></PractitionerRoute>}
        />
        <Route
          path="/practitioner/therapies/edit/:id"
          element={<PractitionerRoute><EditTherapy /></PractitionerRoute>}
        />

        {/* Sessions */}
        <Route
          path="/practitioner/sessions"
          element={<PractitionerRoute><PractitionerSessions /></PractitionerRoute>}
        />

        {/* Community (PRACTITIONER SIDE) */}
        <Route
          path="/practitioner/community"
          element={<PractitionerRoute><PractitionerCommunity /></PractitionerRoute>}
        />

        {/* Products */}
        <Route
          path="/practitioner/products"
          element={<PractitionerRoute><ManageProduct /></PractitionerRoute>}
        />
        <Route
          path="/practitioner/products/create"
          element={<PractitionerRoute><CreateProduct /></PractitionerRoute>}
        />
        <Route
          path="/practitioner/products/edit/:id"
          element={<PractitionerRoute><EditProduct /></PractitionerRoute>}
        />

        {/* ========= FALLBACK ========= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}