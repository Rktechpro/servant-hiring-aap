import { Form, Input, Button, Divider, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  ToolOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { httpsRequest } from "../../lib/http";
import { useAuthStore } from "../store/auth.store";

interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  data?: {
    user?: {
      id: string;
      fullname: string;
      email: string;
      mobile: string;
      role: "CUSTOMER" | "SERVANT";
    };
  };
}

export const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const setAuthUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (values: LoginForm) => {
    try {
      setLoading(true);
      const response = await httpsRequest.post("/auth/login", values);
      const user = response.data?.data?.user;

      if (!user) {
        message.error("User data not found");
        return;
      }

      // Save user in Zustand + localStorage
      setAuthUser(user);

      if (user.role === "SERVANT") {
        navigate("/dashboard-servant", {
          replace: true,
        });
      } else if (user.role === "CUSTOMER") {
        navigate("/dashboard-customer", {
          replace: true,
        });
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid min-h-175 lg:grid-cols-2">
          {/* ================= LEFT SIDE ================= */}
          <div className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-purple-600 p-12 text-white lg:flex">
            {/* Background circles */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10" />

            <div className="absolute -bottom-40 -left-32 h-112.5 w-112.5 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col justify-between">
              <div>
                {/* Logo */}
                <div className="mb-12 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-indigo-600">
                    SH
                  </div>

                  <span className="text-2xl font-bold">ServantHire</span>
                </div>

                {/* Heading */}
                <h1 className="max-w-lg text-5xl font-bold leading-tight">
                  Welcome
                  <span className="block text-purple-200">back.</span>
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-purple-100">
                  Login to manage your bookings, discover trusted servants, or
                  manage your services.
                </p>

                {/* Features */}
                <div className="mt-10 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <CheckCircleOutlined />
                    </div>

                    <span className="text-purple-100">
                      Trusted service professionals
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <CheckCircleOutlined />
                    </div>

                    <span className="text-purple-100">Easy hourly booking</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <CheckCircleOutlined />
                    </div>

                    <span className="text-purple-100">
                      Secure and simple platform
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <SafetyOutlined />
                Your account is protected with secure authentication.
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-600 lg:hidden">
                SH
              </div>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">
                  Welcome back 👋
                </h2>

                <p className="mt-2 text-slate-500">
                  Login to your ServantHire account
                </p>
              </div>

              {/* LOGIN FORM */}
              <Form<LoginForm>
                layout="vertical"
                size="large"
                onFinish={handleLogin}
                requiredMark={false}
              >
                {/* EMAIL */}
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                    },
                    {
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-slate-400" />}
                    placeholder="you@example.com"
                    className="rounded-xl!"
                    autoComplete="email"
                  />
                </Form.Item>

                {/* PASSWORD */}
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password",
                    },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-400" />}
                    placeholder="Enter your password"
                    className="rounded-xl!"
                    autoComplete="current-password"
                  />
                </Form.Item>

                {/* FORGOT PASSWORD */}
                <div className="mb-6 flex justify-end">
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* LOGIN BUTTON */}
                <Form.Item className="mb-5!">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    icon={<ArrowRightOutlined />}
                    iconPlacement="end"
                    className="h-12! rounded-xl! border-0! bg-indigo-600! font-semibold! shadow-lg shadow-indigo-200 hover:bg-indigo-700!"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>
              </Form>

              {/* DIVIDER */}
              <Divider className="my-6!">
                <span className="text-xs text-slate-400">SECURE LOGIN</span>
              </Divider>

              {/* ROLE INFO */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-4 text-center">
                  <HomeOutlined className="mb-2 text-xl text-indigo-600" />

                  <p className="text-sm font-semibold text-slate-700">
                    Customer
                  </p>

                  <p className="mt-1 text-xs text-slate-400">Hire servants</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 text-center">
                  <ToolOutlined className="mb-2 text-xl text-indigo-600" />

                  <p className="text-sm font-semibold text-slate-700">
                    Servant
                  </p>

                  <p className="mt-1 text-xs text-slate-400">Offer services</p>
                </div>
              </div>

              {/* SIGNUP */}
              <p className="text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
