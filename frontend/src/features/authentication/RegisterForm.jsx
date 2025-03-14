import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";

import Loader from "../../ui/Loader";
import axios from "axios";
import { validateEmail, validatePassword } from "./validation";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("jwtToken", response.data.token);

      toast.success(response.data.message);
      setErrors({});
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(
        "Registration failed: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: 'url("public/intro-background.jpg")' }}
    >
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-black bg-opacity-40 p-6 rounded-lg shadow-md w-96"
        >
          <h2 className="text-2xl	text-center text-white font-bold mb-4">
            Create Your Account
          </h2>
          <h3 className="text-sm text-center text-white mb-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </h3>
          <div className="mb-4">
            <label className="block text-white">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 bg-black bg-opacity-20 text-white"
              } rounded-lg focus:outline-none focus:ring ${
                errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 bg-black bg-opacity-20 text-white"
              } rounded-lg focus:outline-none focus:ring ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 bg-black bg-opacity-20 text-white"
              } rounded-lg focus:outline-none focus:ring ${
                errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 bg-black bg-opacity-20 text-white"
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
            className="w-full bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Register
          </button>

          <div className="flex items-center w-full my-4">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-4 text-white">Or Sign Up With</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()(
                (window.location.href = "http://localhost:3000/auth/google")
              );
            }}
            className="bg-blue-500 text-white items-center px-4 flex justify-center gap-2 py-2 rounded-lg w-full hover:bg-blue-300 transition"
          >
            <FaGoogle />
            Google
          </button>
        </form>
      )}
    </div>
  );
}

export default RegisterForm;
