import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { validateEmail } from "../features/authentication/validation";

import { FaGoogle } from "react-icons/fa";

import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";

function Login() {
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        loginPassword,
      });

      localStorage.setItem("jwtToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response?.status === 429) {
        toast.error("Too many login attempts, please try again later.");
      } else {
        toast.error(
          "Login failed: " + (error.response?.data?.message || "Unknown error")
        );
      }
    } finally {
      setLoading(false);
    }

    setEmail("");
    setLoginPassword("");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-96"
        >
          <h2 className="text-2xl text-center font-bold mb-4">
            Login To Your Account
          </h2>
          <h3 className="text-sm text-center mb-5">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </h3>
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
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Login With Email
            </button>

            <div className="flex items-center w-full my-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="mx-4 text-gray-500">Or Sign In With</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "http://localhost:3000/auth/google";
              }}
              className="bg-blue-500 text-white items-center px-4 flex justify-center gap-2 py-2 rounded-lg w-full hover:bg-blue-300 transition"
            >
              <FaGoogle />
              Google
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
