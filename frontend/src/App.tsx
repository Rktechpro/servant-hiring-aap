import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/login";
import { Signup } from "./components/auth/signup";
import DashboardLayout from "./components/layout/DashboardLayout";
import { CustomerRoute } from "./components/ProtactGard/CustomerRoute";
import { ServantRoute } from "./components/ProtactGard/ServantRoute";
import { ProtectedRoute } from "./components/ProtactGard/ProtectedRoute";
import { PublicRoute } from "./components/ProtactGard/PublicRoute";
import ServantPanel from "./components/servant/ServantPanel";
import CustomerProfile from "./components/customer/CustomerProfile";
import CustomerBooking from "./components/customer/customerBooking";
import ServantProfile from "./components/servant/ServantProfile";
import LandingPage from "./components/Homepage/landingPage";
import { CustomerPanel } from "./components/customer/CustomerPanel";
import ServantPayments from "./components/servant/ServantPayments";
import NoteFound from "./components/shaerd/NoteFound";

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="*" element={<NoteFound />} />
      <Route element={<PublicRoute />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
      </Route>

      {/* Common protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* SERVANT PANEL */}
      <Route element={<ServantRoute />}>
        <Route element={<DashboardLayout role="SERVANT" />}>
          <Route path="/dashboard-servant" element={<ServantPanel />} />
          <Route path="/servant/profile" element={<ServantProfile />} />
          <Route path="/servant/earnings" element={<ServantPayments />} />
        </Route>
      </Route>

      {/* CUSTOMER PANEL */}
      <Route element={<CustomerRoute />}>
        <Route element={<DashboardLayout role="CUSTOMER" />}>
          <Route path="/dashboard-customer" element={<CustomerPanel />} />
          <Route path="/customer/bookings" element={<CustomerBooking />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
