import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

function Header() {
  return (
    <header className="w-full bg-white text-black p-4 flex">
      <UserAvatar />
      <HeaderMenu />
    </header>
  );
}

export default Header;
