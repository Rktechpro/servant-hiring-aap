import { Home, CalendarDays, DollarSign, User } from "lucide-react";
import { Layout, Menu, Drawer } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const { Sider } = Layout;

interface SidebarProps {
  role: "CUSTOMER" | "SERVANT";
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const Sidebar = ({ role, collapsed, setCollapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const items =
    role === "SERVANT"
      ? [
          {
            key: "/dashboard-servant",
            icon: <Home size={18} />,
            label: "Dashboard",
          },
          {
            key: "/servant/profile",
            icon: <User size={18} />,
            label: "My Profile",
          },
          {
            key: "/servant/earnings",
            icon: <DollarSign size={18} />,
            label: "Earnings",
          },
        ]
      : [
          {
            key: "/dashboard-customer",
            icon: <Home size={18} />,
            label: "Dashboard",
          },

          {
            key: "/customer/bookings",
            icon: <CalendarDays size={18} />,
            label: "My Bookings",
          },
          {
            key: "/customer/profile",
            icon: <User size={18} />,
            label: "My Profile",
          },
        ];

  const sidebarContent = (
    <>
      <div className="border-b px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <User size={20} className="text-indigo-600" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold capitalize">
              {user?.fullname}
            </p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => {
          navigate(key);
          setCollapsed(true);
        }}
        className="mt-4! border-none!"
      />
    </>
  );

  return (
    <>
      <div className="hidden lg:block">
        <Sider width={250} theme="light" className=" bg-white h-full!">
          {sidebarContent}
        </Sider>
      </div>

      <div className="lg:hidden">
        <Drawer
          placement="left"
          open={!collapsed}
          onClose={() => setCollapsed(true)}
          closable={false}
          size={250}
          styles={{
            body: { padding: 0 },
          }}
        >
          {sidebarContent}
        </Drawer>
      </div>
    </>
  );
};

export default Sidebar;
