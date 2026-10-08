import {
  Home,
  CalendarDays,
  DollarSign,
  User,
  Search,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { Layout, Menu, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const { Sider } = Layout;

interface SidebarProps {
  role: "CUSTOMER" | "SERVANT";
}

const Sidebar = ({ role }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to logout?",
      okText: "Logout",
      cancelText: "Cancel",

      onOk: async () => {
        await logout();
        navigate("/auth/login", { replace: true });
      },
    });
  };

  const servantItems = [
    {
      key: "/dashboard-servant",
      icon: <Home />,
      label: "Dashboard",
    },
    {
      key: "/servant/profile",
      icon: <User />,
      label: "My Profile",
    },
    {
      key: "/servant/booking-requests",
      icon: <CalendarDays />,
      label: "Booking Requests",
    },
    {
      key: "/servant/earnings",
      icon: <DollarSign />,
      label: "Earnings",
    },
  ];

  const customerItems = [
    {
      key: "/dashboard-customer",
      icon: <Home />,
      label: "Dashboard",
    },
    {
      key: "/customer/servants",
      icon: <Search />,
      label: "Find Servants",
    },
    {
      key: "/customer/bookings",
      icon: <CalendarDays />,
      label: "My Bookings",
    },
    {
      key: "/customer/profile",
      icon: <User />,
      label: "My Profile",
    },
  ];

  const items = role === "SERVANT" ? servantItems : customerItems;

  return (
    <Sider breakpoint="lg" collapsedWidth="0" className="!bg-white shadow-lg">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-indigo-600">ServantHub</h1>
      </div>

      {/* User */}
      <div className="border-b px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
            <User className="text-indigo-600" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold">{user?.fullname}</p>

            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        className="!border-none !mt-4"
      />

      {/* Logout */}
      <div className="absolute bottom-0 w-full border-t bg-white">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-6 py-4 text-left text-red-500 hover:bg-red-50"
        >
          <LogOut />
          Logout
        </button>
      </div>
    </Sider>
  );
};

export default Sidebar;
