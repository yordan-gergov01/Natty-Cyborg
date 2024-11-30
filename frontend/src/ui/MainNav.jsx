import { Link } from "react-router";

function MainNav() {
  return (
    <nav className="flex flex-col gap-4">
      <Link
        to="/"
        className="p-2 text-gray-700 hover:bg-gray-400 rounded transition"
      >
        Home
      </Link>
      <Link
        to="/login"
        className="p-2 text-gray-700 hover:bg-gray-400 rounded transition"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="p-2 text-gray-700 hover:bg-gray-400 rounded transition"
      >
        Register as Cyborg
      </Link>
    </nav>
  );
}

export default MainNav;
