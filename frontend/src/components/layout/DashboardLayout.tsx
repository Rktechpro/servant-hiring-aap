import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const { Content } = Layout;

interface DashboardLayoutProps {
  role: "CUSTOMER" | "SERVANT";
}

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Sidebar role={role} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="min-w-0">
        <Navbar setCollapsed={setCollapsed} />
        <Content className="min-w-0 bg-gray-50 p-4 md:p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
