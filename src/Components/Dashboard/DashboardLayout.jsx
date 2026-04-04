import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../../Pages/Dashboard/Dashboard.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
