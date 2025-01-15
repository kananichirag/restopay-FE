import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RestaurantPage from "./components/RestarurantPage";
import ManagerDashboard from "./components/ManagerDashboard";
import ManagerPrivateRoute from "./auth/ManagerPrivateRoute";
import CashiersDashboard from "./components/CashiersDashboard";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import CheckoutPage from "./components/User/CheckoutPage";
import AdminDashboard from "./components/auth/AdminDashboard";
import ManagerSignUpPage from "./pages/ManagerSignUpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/restaurantpage" element={<RestaurantPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="//manager-signup" element={<ManagerSignUpPage />} />
      <Route
        path="/menu/:restaurantId/:tableNumber"
        element={<RestaurantMenuPage />}
      />
      <Route
        path="/manager"
        element={<ManagerPrivateRoute element={<ManagerDashboard />} />}
      />
      <Route
        path="/cashier-panel"
        element={<ManagerPrivateRoute element={<CashiersDashboard />} />}
      />
    </Routes>
  );
}

export default App;
