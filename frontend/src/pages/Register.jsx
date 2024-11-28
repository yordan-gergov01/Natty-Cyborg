import axios from "axios";
import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name,
        email,
        password,
      });

      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("Registration failed: " + error.response.data.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="John Smith"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="johnsmith@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="**********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register as Cyborg</button>
    </form>
  );
}

export default Register;
