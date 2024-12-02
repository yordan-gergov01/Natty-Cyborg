import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !loginPassword) return;

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        loginPassword,
      });

      localStorage.setItem("jwtToken", response.data.token);

      alert(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response.data.message);
      alert(
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            placeholder="**********"
            value={loginPassword}
            name="loginPassword"
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
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
