import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div>
      <Header />
      <Sidebar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
