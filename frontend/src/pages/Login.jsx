import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { validateEmail } from "../features/authentication/validation";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required!" }));
      return;
    } else if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address!" }));
      return;
    }

    if (!loginPassword) {
      setErrors((prev) => ({ ...prev, password: "Password is required!" }));
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        loginPassword,
      });

      localStorage.setItem("jwtToken", response.data.token);

      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }

    setEmail("");
    setLoginPassword("");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="johnsmith@gmail.com"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring ${
              errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            placeholder="**********"
            value={loginPassword}
            name="loginPassword"
            onChange={(e) => setLoginPassword(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring ${
              errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Cyber login
        </button>
      </form>
    </div>
  );
}

export default Login;
