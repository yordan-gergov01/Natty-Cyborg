import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
    } catch (error) {
      console.error(error.response.data.message);
    }
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
        value={password}
        name="loginPassword"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Cyber login</button>
    </form>
  );
}

export default Login;
