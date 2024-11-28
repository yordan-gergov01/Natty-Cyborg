import { Link } from "react-router";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register as Cyborg</Link>
    </nav>
  );
}

export default Navbar;
