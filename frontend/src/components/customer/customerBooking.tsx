import { Card, Tag } from "antd";

interface Booking {
  _id: string;
  servantId: {
    _id: string;
    userId: {
      fullname: string;
      email: string;
      mobile: string;
    };
  };
  bookingDate: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyPrice: number;
  totalAmount: number;
  location: string;
  address: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";
}

const dummyBookings: Booking[] = [
  {
    _id: "booking001",
    servantId: {
      _id: "servant001",
      userId: {
        fullname: "Rahul Kumar",
        email: "rahul@gmail.com",
        mobile: "+919876543210",
      },
    },
    bookingDate: "2026-10-05",
    startTime: "10:00",
    endTime: "14:00",
    hours: 4,
    hourlyPrice: 300,
    totalAmount: 1200,
    location: "Delhi",
    address: "Sector 15, Rohini, Delhi",
    status: "PENDING",
  },

  {
    _id: "booking002",
    servantId: {
      _id: "servant002",
      userId: {
        fullname: "Amit Singh",
        email: "amit@gmail.com",
        mobile: "+919812345678",
      },
    },
    bookingDate: "2026-10-08",
    startTime: "09:00",
    endTime: "13:00",
    hours: 4,
    hourlyPrice: 250,
    totalAmount: 1000,
    location: "Faridabad",
    address: "Sector 21, Faridabad, Haryana",
    status: "ACCEPTED",
  },

  {
    _id: "booking003",
    servantId: {
      _id: "servant003",
      userId: {
        fullname: "Vikas Sharma",
        email: "vikas@gmail.com",
        mobile: "+919998887777",
      },
    },
    bookingDate: "2026-10-10",
    startTime: "11:00",
    endTime: "15:00",
    hours: 4,
    hourlyPrice: 350,
    totalAmount: 1400,
    location: "Noida",
    address: "Sector 62, Noida, UP",
    status: "COMPLETED",
  },
];

const CustomerBooking = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-5 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>

        <p className="text-sm text-slate-500">View all your servant bookings</p>
      </div>

      {dummyBookings.map((booking) => (
        <Card
          key={booking._id}
          className="rounded-2xl! border-0! shadow-sm my-4!"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Servant */}
            <div>
              <p className="text-xs text-slate-400">Servant</p>

              <h2 className="text-lg font-semibold text-slate-800">
                {booking.servantId.userId.fullname}
              </h2>

              <p className="text-sm text-slate-500">
                {booking.servantId.userId.mobile}
              </p>
            </div>

            {/* Status */}
            <div className="md:text-right">
              <Tag
                color={
                  booking.status === "ACCEPTED"
                    ? "green"
                    : booking.status === "COMPLETED"
                      ? "blue"
                      : booking.status === "REJECTED"
                        ? "red"
                        : booking.status === "CANCELLED"
                          ? "default"
                          : "orange"
                }
              >
                {booking.status}
              </Tag>
            </div>

            {/* Date */}
            <div>
              <p className="text-xs text-slate-400">Booking Date</p>

              <p className="font-medium text-slate-700">
                {new Date(booking.bookingDate).toLocaleDateString("en-IN")}
              </p>
            </div>

            {/* Time */}
            <div>
              <p className="text-xs text-slate-400">Time</p>

              <p className="font-medium text-slate-700">
                {booking.startTime} - {booking.endTime}
              </p>
            </div>

            {/* Hours */}
            <div>
              <p className="text-xs text-slate-400">Duration</p>

              <p className="font-medium text-slate-700">
                {booking.hours} hours
              </p>
            </div>

            {/* Hourly Price */}
            <div>
              <p className="text-xs text-slate-400">Hourly Price</p>

              <p className="font-medium text-slate-700">
                ₹{booking.hourlyPrice}/hour
              </p>
            </div>

            {/* Location */}
            <div>
              <p className="text-xs text-slate-400">Location</p>

              <p className="font-medium text-slate-700">{booking.location}</p>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs text-slate-400">Address</p>

              <p className="font-medium text-slate-700">{booking.address}</p>
            </div>

            {/* Total */}
            <div className="border-t pt-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Total Amount</span>

                <span className="text-2xl font-bold text-indigo-600">
                  ₹{booking.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CustomerBooking;
