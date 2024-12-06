import Logout from "../features/authentication/Logout";

function Header() {
  return (
    <header className="w-full bg-white text-black p-4 flex">
      <Logout />
    </header>
  );
}

export default Header;
