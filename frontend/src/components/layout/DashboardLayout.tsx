import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const { Content } = Layout;

interface DashboardLayoutProps {
  role: "CUSTOMER" | "SERVANT";
}

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  return (
    <Layout className="min-h-screen bg-gray-100">
      <Sidebar role={role} />

      <Layout>
        <Navbar />

        <Content className="p-4 md:p-6">
          <div className="min-h-[calc(100vh-100px)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
