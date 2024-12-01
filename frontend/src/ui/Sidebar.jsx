import Logo from "./Logo";
import MainNav from "./MainNav";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 text-white h-screen p-4 flex flex-col gap-12">
      <Logo />
      <MainNav />
    </aside>
  );
}

export default Sidebar;
