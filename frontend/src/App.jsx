import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import MealPlan from "./pages/MealPlan";
import DailyDashboard from "./pages/DailyDashboard";
import Account from "./pages/Account";
import Progress from "./pages/Progress";
import IntroPage from "./pages/IntroPage";

import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/meals" element={<MealPlan />} />
            <Route path="/dashboard" element={<DailyDashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/progress" element={<Progress />} />
          </Route>
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#f6f6f6",
            color: "##393939",
          },
        }}
      />
    </>
  );
}

export default App;
