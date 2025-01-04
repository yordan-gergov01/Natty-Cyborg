import { Outlet } from "react-router";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div
      className="flex min-h-screen text-white"
      style={{ backgroundImage: 'url("public/intro-background.jpg")' }}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 bg-black bg-opacity-30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
