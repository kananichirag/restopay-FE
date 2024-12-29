import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./components/auth/Dashboard";
import RestaurantPage from "./components/RestarurantPage";
import ManagerDashboard from "./components/ManagerDashboard";
import ManagerPrivateRoute from "./auth/ManagerPrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/restaurantpage" element={<RestaurantPage />} />
      <Route
        path="/manager"
        element={<ManagerPrivateRoute element={<ManagerDashboard />} />}
      />
    </Routes>
  );
}

export default App;
