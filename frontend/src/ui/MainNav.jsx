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
        className="border-2 border-transparent p-2 text-xl text-gray-100 hover:border-white rounded transition flex items-center gap-2"
      >
        <HiOutlineHome />
        <span>Home</span>
      </Link>
      <Link
        to="/workouts"
        className="border-2 border-transparent p-2 text-xl text-gray-100 hover:border-white rounded transition flex items-center gap-2"
      >
        <CgGym />
        <span>Workouts</span>
      </Link>
      <Link
        to="/meals"
        className="border-2 border-transparent p-2 text-xl text-gray-100 hover:border-white rounded transition flex items-center gap-2"
      >
        <GiMeal />
        <span>Meals</span>
      </Link>
      <Link
        to="/progress"
        className="border-2 border-transparent p-2 text-xl text-gray-100 hover:border-white rounded transition flex items-center gap-2"
      >
        <GiProgression />
        <span>My Progress</span>
      </Link>
    </nav>
  );
}

export default MainNav;
