import axios from "axios";
import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("https://localhost:3000/register", {
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
      <input type="text" placeholder="John Smith" value={name} />
      <input type="email" placeholder="johnsmith@gmail.com" value={email} />
      <input type="password" placeholder="**********" value={password} />
      <button type="submit">Register as Cyborg</button>
    </form>
  );
}

export default Register;
