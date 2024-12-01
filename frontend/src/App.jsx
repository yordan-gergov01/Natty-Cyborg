import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import MealPlan from "./pages/MealPlan";
import DailyDashboard from "./pages/DailyDashboard";
import Account from "./pages/Account";
import Progress from "./pages/Progress";

import AppLayout from "./ui/AppLayout";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/meals" element={<MealPlan />} />
          <Route path="/dashboard" element={<DailyDashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
