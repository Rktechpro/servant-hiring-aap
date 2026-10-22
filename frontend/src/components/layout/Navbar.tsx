import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "lucide-react";
import { Avatar, Badge, Dropdown, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface NavbarProps {
  setCollapsed: (value: boolean) => void;
}

const Navbar = ({ setCollapsed }: NavbarProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () =>
        navigate(
          user?.role === "SERVANT" ? "/servant/profile" : "/customer/profile",
        ),
    },
    {
      key: "logout",
      label: "Logout",
      danger: true,
      onClick: async () => {
        await logout();
        navigate("/auth/login", { replace: true });
      },
    },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="text"
          className="flex! items-center! justify-center! lg:hidden!"
          aria-label="Open sidebar"
          icon={<Menu size={23} />}
          onClick={() => setCollapsed(false)}
        />

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-gray-800 capitalize">
            Welcome back, {user?.fullname}
          </h2>

          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your account and bookings
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 md:gap-5">
        <Badge count={0}>
          <BellOutlined className="cursor-pointer text-xl text-gray-600" />
        </Badge>

        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Avatar
            className="cursor-pointer bg-indigo-600"
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
