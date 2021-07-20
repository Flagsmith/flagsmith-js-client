import { useState } from 'react';

import Home from 'components/home';
import MobileNavBar from 'components/mobile-nav-bar';
import Sidebar from 'components/sidebar';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Main column */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <MobileNavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Home />
      </div>
    </div>
  );
}

export default MainLayout;
