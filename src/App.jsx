import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./components/auth/Dashboard";
import RestaurantPage from "./components/RestarurantPage";
import ManagerDashboard from "./components/ManagerDashboard";
import ManagerPrivateRoute from "./auth/ManagerPrivateRoute";
import CashiersDashboard from "./components/CashiersDashboard";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/restaurantpage" element={<RestaurantPage />} />
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
