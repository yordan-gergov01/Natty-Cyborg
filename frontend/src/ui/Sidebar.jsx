import { useState } from "react";

import Logo from "./Logo";
import MainNav from "./MainNav";

import { FiMenu } from "react-icons/fi";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 fixed md:relative z-50 bg-gray-900 text-white h-screen p-4 flex flex-col gap-12 w-64 transition-transform duration-300`}
    >
      <div className="flex justify-between items-center">
        <Logo />
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiMenu />
        </button>
      </div>
      <MainNav />
    </aside>
  );
}

export default Sidebar;
