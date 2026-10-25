import {ArrowRight,CheckCircle2,ShieldCheck,Star,Search,Sparkles,Utensils,House,Shirt,Clock3,Users,
  BriefcaseBusiness,
  Menu,
  X,
  LogOut,
  UserRound,
  MapPin,
  IndianRupee,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { useAuthStore } from "../store/auth.store";
import { httpsRequest } from "../../lib/http";
import {BookingModal} from "../shaerd/BookingModal";
import useSWR from "swr";
import { fetchUrl } from "../../lib/fetch";


interface ServantProfile {
  _id: string;
  userId?: {
    fullname?: string;
    email?: string;
  };
  image?: string;
  bio?: string;
  skills?: string[] | string;
  location?: string;
  hourlyPrice?: number;
  availability?: boolean;
  relevanceScore?: number;
}

const services = [
  {
    title: "Cooking",
    description: "Everyday meals prepared at home.",
    icon: Utensils,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Cleaning",
    description: "Keep your home fresh and tidy.",
    icon: Sparkles,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Household Help",
    description: "Reliable help with daily tasks.",
    icon: House,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Laundry",
    description: "Help with washing and ironing.",
    icon: Shirt,
    color: "bg-sky-100 text-sky-600",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore services",
    description: "Choose the household service you need.",
  },
  {
    number: "02",
    title: "Find your helper",
    description: "Compare profiles, skills and hourly prices.",
  },
  {
    number: "03",
    title: "Book with ease",
    description: "Select a suitable time and submit your booking.",
  },
];

const LandingPage = () => {
  const { data: customerResponse } = useSWR("/customer",fetchUrl);

  const customer = customerResponse?.data;
  console.log(customer)
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [servants, setServants] = useState<ServantProfile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedServantId, setSelectedServantId] = useState("");

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const profilePath =
    user?.role === "SERVANT" ? "/servant/profile" : "/customer/profile";

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/auth/login", { replace: true });
  };

  const profileMenu: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserRound size={16} />,
      label: "My Profile",
      onClick: () => navigate(profilePath),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const handleSearch = async (queryOverride?: string) => {
    const query = (queryOverride ?? search).trim();

    if (!query) {
      setError("Please enter a service to search.");
      setServants([]);
      setHasSearched(false);
      return;
    }

    setSearch(query);
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await httpsRequest.get("/servant/semantic-search", {
        params: {
          q: query,
          limit: 20,
        },
      });

      const results = response.data?.data;

      setServants(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Servant semantic search failed:", err);
      setServants([]);
      setError(
        "Unable to search services. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image?: string) => {
    if (!image) return undefined;
    if (/^https?:\/\//i.test(image)) return image;

    const baseURL = httpsRequest.defaults.baseURL;

    if (!baseURL) return image;

    return `${baseURL.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
  };

  const handleBookNow = (servantId: string) => {
    console.log("Selected Servant ID:", servantId);
    setSelectedServantId(servantId);
    setBookingOpen(true);
  };

  const bookingHandle = async (value: any) => {
    try {
      const { data } = await httpsRequest.post("/booking/createBooking", value);
      console.log("Booking Success:", data);
      message.success("Booking created successfully!");
      navigate("/dashboard-customer")
      setBookingOpen(false);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Booking failed");
    }
  };
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <header className="fixed top-0 z-40 hidden w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl md:block">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <House size={23} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Servant<span className="text-indigo-600">hiring</span>
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <a
              href="#services"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              Services
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              How it works
            </a>
            <a
              href="#why-us"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              Why Servant hiring
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Dropdown
                menu={{ items: profileMenu }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button
                  type="button"
                  aria-label="Open profile menu"
                  className="rounded-full"
                >
                  <Avatar
                    size={42}
                    className="bg-indigo-600"
                    icon={<UserRound size={21} />}
                  />
                </button>
              </Dropdown>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/signup"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Get Started <ArrowRight className="ml-1 inline" size={16} />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <button
        type="button"
        aria-label={menuOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="fixed left-4 top-4 z-70 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg md:hidden"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/50 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-60 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-20 shrink-0 items-center border-b border-slate-100 px-5 py-4">
          {user ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate(profilePath);
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-indigo-50"
            >
              <Avatar size={42} className="bg-indigo-600">
                {user.fullname?.charAt(0).toUpperCase()}
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">
                  {user.fullname}
                </p>
                <p className="text-xs text-slate-500">
                  {user.role} · My Profile
                </p>
              </div>
            </button>
          ) : (
            <div className="flex w-full gap-2">
              <Link
                to="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-xl px-3 py-3 text-center font-medium text-slate-700 hover:bg-indigo-50"
              >
                Log in
              </Link>
              <Link
                to="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-xl bg-indigo-600 px-3 py-3 text-center font-semibold text-white"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            Navigation
          </p>
          <a
            href="#services"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <BriefcaseBusiness size={20} /> Services
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <CheckCircle2 size={20} /> How it works
          </a>
          <a
            href="#why-us"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <ShieldCheck size={20} /> Why Servant hiring
          </a>

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={19} /> Logout
            </button>
          )}
        </nav>
      </aside>

      <section className="relative bg-linear-to-br from-indigo-50 via-white to-violet-50 md:pt-16">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
              <Sparkles size={16} /> A smarter way to manage your home
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your Home Deserves
              <span className="mt-2 block text-indigo-600">
                The Right Helping Hands.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Find household professionals for cooking, cleaning and everyday
              tasks. Discover skills, compare prices and book the help you need.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/servants"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Find a Professional <ArrowRight size={19} />
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <BriefcaseBusiness size={19} /> Become a Servant
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" /> Easy
                booking
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />{" "}
                Transparent pricing
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full bg-violet-200/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white bg-white p-3 shadow-2xl shadow-indigo-100">
              <img
                src="./worker.avif"
                alt="Professional household cleaning service"
                className="h-80 w-full rounded-2xl object-cover sm:h-107.5"
              />
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck size={25} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      Your home, your choice
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Explore profiles and choose the right fit.
                    </p>
                  </div>
                  <CheckCircle2 className="text-emerald-600" size={23} />
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-12 hidden items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:flex">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <Star size={22} fill="currentColor" />
              </div>
              <div>
                <p className="font-bold">Quality comes first</p>
                <p className="text-xs text-slate-500">
                  Choose based on profile details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Semantic Search */}
        {user?.role === "CUSTOMER" && (
          <div className="relative mx-auto max-w-5xl px-5 pb-14 lg:px-8">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleSearch();
              }}
              className="rounded-3xl border border-slate-100 bg-white p-3 shadow-xl shadow-indigo-100/70 sm:p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                  <Search className="shrink-0 text-indigo-600" size={22} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="What service are you looking for?"
                    aria-label="Search household services"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Searching..." : "Search Services"}
                </button>
              </div>
            </form>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {loading && (
              <div className="py-8 text-center text-sm font-medium text-slate-500">
                Finding relevant household professionals...
              </div>
            )}

            {!loading && hasSearched && !error && servants.length === 0 && (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center">
                <Search size={32} className="mx-auto text-slate-400" />
                <h3 className="mt-3 font-bold text-slate-800">
                  No matching services found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different search, such as cooking, cleaning or household
                  help.
                </p>
              </div>
            )}

            {!loading && servants.length > 0 && (
              <section className="mt-8" aria-live="polite">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Matching professionals
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {servants.length} result{servants.length === 1 ? "" : "s"}{" "}
                      for "{search}"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setServants([]);
                      setHasSearched(false);
                      setError("");
                    }}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Clear results
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {servants.map((servant) => (
                    <article
                      key={servant._id}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      {servant.image ? (
                        <img
                          src={getImageUrl(servant.image)}
                          alt={servant.userId?.fullname || "Service provider"}
                          className="h-48 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-36 items-center justify-center bg-indigo-50 text-indigo-400">
                          <UserRound size={48} />
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-bold text-slate-900">
                            {servant.userId?.fullname || "Service Provider"}
                          </h3>
                          {typeof servant.relevanceScore === "number" && (
                            <span className="shrink-0 rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">
                              Match {(servant.relevanceScore * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                          {servant.bio || "Household service professional."}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                          <MapPin size={16} className="shrink-0" />
                          {servant.location || "Location not provided"}
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <BriefcaseBusiness
                            size={16}
                            className="text-indigo-600"
                          />
                          {Array.isArray(servant.skills)
                            ? servant.skills.join(", ")
                            : servant.skills || "Household services"}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="flex items-center font-bold text-indigo-600">
                            <IndianRupee size={17} />
                            {servant.hourlyPrice ?? "N/A"}
                            <span className="ml-1 text-xs font-normal text-slate-500">
                              / hour
                            </span>
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              servant.availability
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {servant.availability
                              ? "Available"
                              : "Check availability"}
                          </span>
                        </div>

                        <Link
                          to="/"
                          onClick={() => handleBookNow(servant._id)}
                          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                        >
                          Book Now <ArrowRight size={16} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
                <BookingModal
                open={bookingOpen}
                servantId={selectedServantId}
                customer={{
                   location: customer?.locationCustomer ?? "",
                   address: customer?.addressCustomer ?? "",
                }}
                 onClose={() => setBookingOpen(false)}
                 onSubmit={bookingHandle}
                />
              </section>
            )}
          </div>
        )}
      </section>

      <section
        id="services"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
      >
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              What we offer
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Help for every corner of your home
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Discover services that make everyday life a little easier.
            </p>
          </div>
          <Link
            to="/servants"
            className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-800"
          >
            Explore services <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                type="button"
                key={service.title}
                className="group rounded-3xl border border-slate-100 bg-white p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/60"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.color}`}
                >
                  <Icon size={27} />
                </div>
                <h3 className="mt-6 text-xl font-bold">{service.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
                  Find help{" "}
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Simple process
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Getting help is easier than ever
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Three simple steps to find a professional who fits your needs.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-slate-100 bg-white p-8"
              >
                <span className="text-4xl font-black text-indigo-100">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="why-us"
        className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Why HomeEase
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            More time for what matters most.
          </h2>
          <p className="mt-5 leading-8 text-slate-500">
            Spend less time searching and more time enjoying your day. Review
            professional profiles, explore their skills and find a service that
            suits your household.
          </p>
          <div className="mt-8 space-y-5">
            {[
              ["Choice that fits you", "Explore profiles, skills and prices."],
              [
                "Simple booking experience",
                "Request a service with your preferred details.",
              ],
              [
                "Flexible household support",
                "Find help for different everyday needs.",
              ],
            ].map(([title, description]) => (
              <div className="flex gap-4" key={title}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-linear-to-br from-indigo-600 to-violet-700 p-8 text-white sm:p-12">
          <Users size={38} />
          <h3 className="mt-8 text-3xl font-black">
            Great service starts with the right connection.
          </h3>
          <p className="mt-4 leading-7 text-indigo-100">
            Whether you need help at home or want to offer your professional
            skills, HomeEase helps bring customers and servants together.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/auth/signup"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Join Servanthiring
            </Link>
            <Link
              to="/servants"
              className="rounded-xl border border-white/30 px-5 py-3 text-center font-bold text-white transition hover:bg-white/10"
            >
              Browse profiles
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-12 sm:py-16">
          <Clock3 className="mx-auto text-indigo-300" size={38} />
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-black text-white sm:text-4xl">
            Make room for more of your life.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            Start exploring household services and find the right help for your
            home today.
          </p>
          <Link
            to="/auth/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-7 py-4 font-bold text-white transition hover:bg-indigo-400"
          >
            Get Started <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-extrabold">
            <House size={22} className="text-indigo-600" />
            Servant<span className="-ml-2 text-indigo-600">hiring</span>
          </Link>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} HomeEase. Made for easier living.
          </p>
          <div className="flex gap-5 text-sm text-slate-500">
            <Link to="/auth/login" className="hover:text-indigo-600">
              Login
            </Link>
            <Link to="/auth/signup" className="hover:text-indigo-600">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
