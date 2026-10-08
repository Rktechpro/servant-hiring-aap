import { BellOutlined, UserOutlined } from "@ant-design/icons";

import { Avatar, Badge, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const Navbar = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => {
        if (user?.role === "SERVANT") {
          navigate("/servant/profile");
        } else {
          navigate("/customer/profile");
        }
      },
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
    <div className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      {/* Mobile / title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {user?.fullname}
        </h2>

        <p className="hidden text-xs text-gray-500 sm:block">
          Manage your account and bookings
        </p>
      </div>

      <div className="flex items-center gap-5">
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
    </div>
  );
};

export default Navbar;
