import { FiMenu } from "react-icons/fi";

import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

function Header({ toggleSidebar }) {
  return (
    <header className="w-full gap-4 text-white py-2 px-4 flex justify-between items-center md:justify-end">
      <button className="md:hidden text-2xl" onClick={toggleSidebar}>
        <FiMenu />
      </button>
      <div className="flex items-center gap-4">
        <UserAvatar />
        <HeaderMenu />
      </div>
    </header>
  );
}

export default Header;
