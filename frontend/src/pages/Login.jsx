import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !loginPassword) return;

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        loginPassword,
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error.response.data.message);
      alert("Login failed: " + error.response.data.message);
    }

    setEmail("");
    setLoginPassword("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="johnsmith@gmail.com"
        value={email}
        name="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="**********"
        value={loginPassword}
        name="loginPassword"
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <button type="submit">Cyber login</button>
    </form>
  );
}

export default Login;
