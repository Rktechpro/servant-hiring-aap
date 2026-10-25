import { useRef, useState } from "react";
import useSWR from "swr";
import {
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle,
  Edit,
  BriefcaseBusiness,
  IndianRupee,
  CalendarDays,
} from "lucide-react";
import { Avatar, Button, Card, Skeleton, message, Tag } from "antd";
import type { ChangeEvent } from "react";
import { httpsRequest } from "../../lib/http";
import { useAuthStore } from "../store/auth.store";
import ServantCreate from "./ServantCreate";

import { fetchUrl } from "../../lib/fetch";
import { ServantProfileModal } from "../shaerd/ServantProfileModal";

interface ServantFormData {
  bio?: string;
  skills?: string[] | string;
  location?: string;
  hourlyPrice?: number;
  availability?: boolean;
  isActive?: boolean;
}

const ServantProfile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuthStore();

  const {
    data: respose,
    isLoading,
    error,
    mutate,
  } = useSWR("/servant", fetchUrl);

  // Assumes fetchUrl returns the API response object.
  const servants = respose?.data ?? [];
  const servant = servants.find((item: any) => item.userId?._id === user?.id);

  console.log(servant);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Please select a valid image");
      event.target.value = "";
      return;
    }

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
      message.success("Servant profile image updated successfully");
      await mutate();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to upload profile image",
      );
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (values: ServantFormData) => {
    try {
      setLoading(true);
      await httpsRequest.put("/servant/updateServant", values);
      message.success("Customer profile updated successfully");
      setOpen(false);
      await mutate();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
      <div className="p-6 text-red-500">
        Failed to load servant profile. Please try again.
      </div>
    );
  }

  if (!servant) {
    return <ServantCreate />;
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
                    servant.image
                      ? `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${servant.image}`
                      : undefined
                  }
                  icon={
                    !servant.image && (
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
                  <Camera size={18} />
                </button>
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold capitalize text-slate-800">
                    {servant.userId?.fullname || user?.fullname || "Servant"}
                  </h1>
                  <CheckCircle className="text-green-600" size={20} />
                </div>

                <p className="mt-1 text-base text-slate-500">Servant</p>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={17} />
                  {servant.location || "Location not provided"}
                </p>

                <div className="mt-2">
                  <Tag color={servant.isActive ? "success" : "default"}>
                    {servant.isActive ? "Available" : "Unavailable"}
                  </Tag>
                </div>
              </div>
            </div>

            <Button
              type="primary"
              icon={<Edit size={16} />}
              size="large"
              className="rounded-xl!"
              onClick={() => setOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
        <div className="space-y-6 lg:col-span-2">
          <Card
            title={<span className="text-lg font-semibold">About Me</span>}
            className="rounded-2xl! border-0! shadow-sm my-2!"
          >
            <p className="leading-7 text-slate-600">
              {servant.bio || "No bio added yet."}
            </p>
          </Card>

          <Card
            title={<span className="text-lg font-semibold">My Skills</span>}
            className="rounded-2xl! border-0! shadow-sm my-2!"
          >
            <div className="flex flex-wrap gap-2">
              {servant?.skills?.length > 0 ? (
                servant.skills.map((skill: string, index: number) => (
                  <Tag color="purple" key={`${skill}-${index}`}>
                    {skill}
                  </Tag>
                ))
              ) : (
                <p className="text-slate-500">No skills added yet.</p>
              )}
            </div>
          </Card>

          <Card
            title={
              <span className="text-lg font-semibold">
                Location Information
              </span>
            }
            className="rounded-2xl! border-0! shadow-sm my-2!"
          >
            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5">
              <MapPin className="text-indigo-600" size={22} />
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {servant.servantlocation || "Location not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5">
      <MapPin className="text-violet-600" size={22} />

      <div>
        <p className="text-xs text-slate-400">Address</p>
        <p className="mt-1 text-sm font-medium text-slate-700">
          {servant.servantAddress || "Address not provided"}
        </p>
      </div>
    </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            title={
              <span className="text-lg font-semibold">Contact Information</span>
            }
            className="rounded-2xl! border-0! shadow-sm"
          >
            <div className="space-y-5">
              <div className="flex gap-3">
                <Mail className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-700">
                    {servant.userId?.email ||
                      user?.email ||
                      "Email not provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {servant.userId?.mobile || "Phone not provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <IndianRupee className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-slate-400">Hourly Price</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {servant.hourlyPrice != null
                      ? `₹${servant.hourlyPrice} / hour`
                      : "Price not provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarDays className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-slate-400">Availability</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                <Tag color={servant.isActive ? "success" : "default"}>
                    {servant.isActive ? "Available" : "Unavailable"}
                  </Tag>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <BriefcaseBusiness className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-slate-400">Profile Status</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {servant.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <ServantProfileModal
            open={open}
            loading={loading}
            onCancel={() => setOpen(false)}
            onSubmit={handleSubmit}
            mode="edit"
          />
        </div>
      </div>
    </div>
  );
};

export default ServantProfile;
