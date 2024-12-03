import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  validateEmail,
  validatePassword,
} from "../features/authentication/validation";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      setErrors((prev) => ({ ...prev, fields: "All fields are required!" }));
      return;
    }

    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Full name is required!" }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, name: null }));
    }

    if (!email || !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address!" }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, email: null }));
    }

    if (!password || !validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and special character (e.g. '@, $, #').",
      }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, password: null }));
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match!",
      }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("jwtToken", response.data.token);

      alert(response.data.message);
      setErrors({});
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(
        "Registration failed: " +
          (error.response?.data?.message || "Unknown error")
      );
    }

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl	font-bold mb-4">Register as Cyborg</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring ${
              errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="johnsmith@gmail.com"
            value={email}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            placeholder="**********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring ${
              errors.confirmPassword
                ? "focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        {errors.fields && (
          <p className="text-red-500 text-sm">{errors.fields}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
