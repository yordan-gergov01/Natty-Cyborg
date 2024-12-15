import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

function Header() {
  return (
    <header className="w-full bg-white gap-4 text-black py-2 px-4 flex justify-end items-center font-fitness">
      <UserAvatar />
      <HeaderMenu />
    </header>
  );
}

export default Header;
