import { Form, Input, Button, Select, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  ToolOutlined,
} from "@ant-design/icons";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhoneInput } from "../shaerd/PhoneInput";
import { httpsRequest } from "../../lib/http";
import { catchError } from "../../lib/catchError";

interface SignupForm {
  fullname: string;
  email: string;
  mobile: string;
  password: string;
  role: "CUSTOMER" | "SERVANT";
}

export const Signup = () => {
  const router = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SignupForm | null>(null);

  const handleSignup = async (values: SignupForm) => {
    try {
      const respose = await httpsRequest.post("/auth/signup", values);
      setForm(respose.data);
      router("/auth/login");
      console.log("Signup successful:", respose.data);
    } catch (err) {
      catchError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid min-h-175 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-purple-600 p-12 text-white lg:flex">
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
                  Find help.
                  <span className="block text-purple-200">
                    Hire with confidence.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-purple-100">
                  Create your account and connect with trusted household service
                  professionals around you.
                </p>

                {/* Features */}
                <div className="mt-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </div>

                    <span className="text-purple-100">
                      Find trusted servants near you
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </div>

                    <span className="text-purple-100">
                      Book servants on an hourly basis
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </div>

                    <span className="text-purple-100">
                      Manage bookings easily
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-purple-200">
                Simple hiring. Trusted service. Better experience.
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-600 lg:hidden">
                SH
              </div>

              {/* Header */}
              <div className="mb-7">
                <h2 className="text-3xl font-bold text-slate-900">
                  Create account 🚀
                </h2>

                <p className="mt-2 text-slate-500">
                  Join ServantHire and get started today
                </p>
              </div>

              {/* FORM */}
              <Form<SignupForm>
                layout="vertical"
                size="large"
                onFinish={handleSignup}
                requiredMark={false}
              >
                {/* FULL NAME */}
                <Form.Item
                  label="Full Name"
                  name="fullname"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your full name",
                    },
                    {
                      min: 2,
                      message: "Name must be at least 2 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-slate-400" />}
                    placeholder="Ravi Kumar"
                    className="rounded-xl!"
                    autoComplete="name"
                  />
                </Form.Item>

                {/* EMAIL + MOBILE */}
                <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
                  {/* EMAIL */}
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Email is required",
                      },
                      {
                        type: "email",
                        message: "Invalid email",
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

                  {/* MOBILE */}
                  <Form.Item
                    label="Mobile"
                    name="mobile"
                    rules={[
                      {
                        required: true,
                        message: "Mobile is required",
                      },
                    ]}
                  >
                    <PhoneInput />
                  </Form.Item>
                </div>

                {/* ROLE */}
                <Form.Item
                  label="I am a"
                  name="role"
                  initialValue="CUSTOMER"
                  rules={[
                    {
                      required: true,
                      message: "Please select your role",
                    },
                  ]}
                >
                  <Select
                    className="h-12!"
                    options={[
                      {
                        label: (
                          <span className="flex items-center gap-2">
                            <HomeOutlined />
                            Customer
                          </span>
                        ),
                        value: "CUSTOMER",
                      },
                      {
                        label: (
                          <span className="flex items-center gap-2">
                            <ToolOutlined />
                            Servant
                          </span>
                        ),
                        value: "SERVANT",
                      },
                    ]}
                  />
                </Form.Item>

                {/* PASSWORD */}
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter password",
                    },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-400" />}
                    placeholder="Create password"
                    className="rounded-xl!"
                    autoComplete="new-password"
                  />
                </Form.Item>

                {/* SUBMIT */}
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
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form.Item>
              </Form>

              {/* DIVIDER */}
              <Divider className="my-6!">
                <span className="text-xs text-slate-400">
                  ALREADY HAVE AN ACCOUNT?
                </span>
              </Divider>

              {/* LOGIN */}
              <p className="text-center text-sm text-slate-500">
                Already registered?{" "}
                <Link
                  to="/auth/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
