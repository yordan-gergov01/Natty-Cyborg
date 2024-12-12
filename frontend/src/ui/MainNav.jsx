import { Link } from "react-router";

import { HiOutlineHome } from "react-icons/hi2";
import { CgGym } from "react-icons/cg";
import { GiMeal } from "react-icons/gi";
import { GiProgression } from "react-icons/gi";

function MainNav() {
  return (
    <nav className="flex flex-col gap-4">
      <Link
        to="/"
        className="p-2 text-xl text-gray-700 hover:bg-gray-400 rounded transition flex items-center gap-2"
      >
        <HiOutlineHome />
        <span>Home</span>
      </Link>
      <Link
        to="/workouts"
        className="p-2 text-xl text-gray-700 hover:bg-gray-400 rounded transition flex items-center gap-2"
      >
        <CgGym />
        <span>My Workouts</span>
      </Link>
      <Link
        to="/meals"
        className="p-2 text-xl text-gray-700 hover:bg-gray-400 rounded transition flex items-center gap-2"
      >
        <GiMeal />
        <span>Meals</span>
      </Link>
      <Link
        to="/progress"
        className="p-2 text-xl text-gray-700 hover:bg-gray-400 rounded transition flex items-center gap-2"
      >
        <GiProgression />
        <span>My Progress</span>
      </Link>
    </nav>
  );
}

export default MainNav;
