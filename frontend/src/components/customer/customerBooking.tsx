import { Card, Tag, Alert, Empty, Skeleton } from "antd";
import useSWR from "swr";
import { fetchUrl } from "../../lib/fetch";

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

const CustomerBooking = () => {
  const { data, error, isLoading } = useSWR<Booking | any>(
    "/booking/my-bookings",
    fetchUrl,
  );
  const booking = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        title="Failed to load bookings"
        description="Please try again later."
        showIcon
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-sm text-slate-500">View all your servant bookings</p>
      </div>

      {booking.length === 0 ? (
        <Empty description="No bookings found" />
      ) : (
        booking.map((item: any, index: number) => (
          <Card key={index} className="my-4! rounded-2xl! border-0! shadow-sm">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs text-slate-400">Servant</p>
                <h2 className="text-lg font-semibold text-slate-800 capitalize">
                  {item.servant?.fullname || "Name unavailable"}
                </h2>
                <p className="text-sm text-slate-500 capitalize">
                  {item.servant?.mobile || "Mobile unavailable"}
                </p>
              </div>

              <div className="md:text-right">
                <Tag
                  color={
                    item.status === "ACCEPTED"
                      ? "green"
                      : item.status === "COMPLETED"
                        ? "blue"
                        : item.status === "REJECTED"
                          ? "red"
                          : item.status === "CANCELLED"
                            ? "default"
                            : "orange"
                  }
                >
                  {item.status}
                </Tag>
              </div>

              <div>
                <p className="text-xs text-slate-400">Booking Date</p>
                <p className="font-medium text-slate-700">
                  {new Date(item.bookingDate).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Time</p>
                <p className="font-medium text-slate-700">
                  {item.startTime} - {item.endTime}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Duration</p>
                <p className="font-medium text-slate-700">{item.hours} hours</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Hourly Price</p>
                <p className="font-medium text-slate-700">
                  ₹{item.hourlyPrice}/hour
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="font-medium text-slate-700">{item.location}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Address</p>
                <p className="font-medium text-slate-700">{item.address}</p>
              </div>

              <div className="border-t pt-4 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{item.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default CustomerBooking;
