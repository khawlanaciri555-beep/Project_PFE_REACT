import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../../Pages/Dashboard/Dashboard.css';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true); // Default to collapsed as requested

  return (
    <div className="dashboard-container">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`dashboard-main ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
