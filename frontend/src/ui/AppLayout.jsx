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
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 bg-gray-800 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
