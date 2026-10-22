import { useRef, useState } from "react";
import useSWR from "swr";
import {
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle,
  Edit,
  Home,
} from "lucide-react";
import { Avatar, Button, Card, Skeleton, message } from "antd";
import type { ChangeEvent } from "react";

import { httpsRequest } from "../../lib/http";
import { useAuthStore } from "../store/auth.store";
import CustomerProfileModal from "../shaerd/model";
import { fetchUrl } from "../../lib/fetch";
import moment from "moment";
import Createprofile from "./createCustomer";

interface CustomerFormData {
  image?: string;
  address: string;
  location: string;
}

const CustomerProfile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const {
    data: response,
    isLoading,
    error,
    mutate,
  } = useSWR("/customer", fetchUrl);

  const handleSubmit = async (values: CustomerFormData) => {
    try {
      setLoading(true);
      await httpsRequest.put("/customer/updateCustomer", values);
      message.success("Customer profile updated successfully");
      setOpen(false);
      await mutate();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Please select a valid image");
      event.target.value = "";
      return;
    }

    // restrict image size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image size must be less than 5 MB");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      await httpsRequest.put("/servant/imageServantProfile", formData);
      message.success("Profile image updated successfully");
      await mutate();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to update profile image",
      );
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">Failed to load customer profile</div>
    );
  }

  const customer = response.data;
  if (!customer) {
    return <Createprofile />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="overflow-hidden rounded-3xl! border-0! shadow-sm">
        <div className="h-44 bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600" />

        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-5">
              <div className="relative">
                <Avatar
                  size={120}
                  src={
                    customer.image
                      ? `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${customer.image}`
                      : undefined
                  }
                  icon={
                    !customer.image && (
                      <span className="text-3xl">
                        {user?.fullname?.charAt(0).toUpperCase()}
                      </span>
                    )
                  }
                  className="border-4! border-white! bg-indigo-100! text-indigo-600! shadow-md"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}
                  title="Update profile image"
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50"
                >
                  <Camera />
                </button>
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold capitalize text-slate-800">
                    {customer.userId?.fullname || user?.fullname}
                  </h1>

                  <CheckCircle className="text-green-600!" />
                </div>

                <p className="mt-1 text-base text-slate-500">Customer</p>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin />
                  {customer.location || "Location not provided"}
                </p>
              </div>
            </div>

            <Button
              type="primary"
              icon={<Edit />}
              size="large"
              className="rounded-xl!"
              onClick={() => setOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6! lg:col-span-2">
          <Card
            title={<span className="text-lg font-semibold">About Me</span>}
            className="my-4! rounded-2xl! border-0! shadow-sm"
          >
            <p className="leading-7 text-slate-600">
              {customer.address
                ? `Customer located in ${customer.location || "your area"}.`
                : "No customer profile information added yet."}
            </p>
          </Card>

          <Card
            title={
              <span className="text-lg font-semibold">Address Information</span>
            }
            className="rounded-2xl! border-0! shadow-sm"
          >
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Home />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Full Address</p>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
                    {customer.address || "Address not provided"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            title={
              <span className="text-lg font-semibold">Contact Information</span>
            }
            className="my-4! rounded-2xl! border-0! shadow-sm"
          >
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Mail />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {customer.userId?.email ||
                      user?.email ||
                      "Email not provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Phone />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {customer.userId?.mobile || "Phone not provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {customer.location || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="my-4! rounded-2xl! border-0! bg-linear-to-br from-indigo-600 to-violet-600! shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                <CheckCircle />
              </div>

              <div>
                <p className="font-semibold text-white">Customer Profile</p>

                <p className="text-xs text-indigo-100">
                  {customer.createdAt
                    ? moment(customer.createdAt).format("MMMM Do YYYY")
                    : "Date not available"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <CustomerProfileModal
          open={open}
          loading={loading}
          onCancel={() => setOpen(false)}
          onSubmit={handleSubmit}
          initialValues={customer}
          mode="edit"
        />
      </div>
    </div>
  );
};

export default CustomerProfile;
