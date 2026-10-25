import { useEffect } from "react";
import useSWR from "swr";
import { Button, Card, Empty, Spin, Tag, Typography, message } from "antd";
import { CheckCircle, XCircle, CalendarDays, Clock, MapPin} from "lucide-react";
import { httpsRequest } from "../../lib/http";
import { bookingSocket } from "../../lib/bookingSocket";

const { Title, Text } = Typography;

interface Booking {
  _id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyPrice: number;
  totalAmount: number;
  location: string;
  address: string;
  status: string;
  customerId?: {
    fullname?: string;
  };
}

const fetcher = async (url: string) => {
  const res = await httpsRequest.get(url);
  return res.data.data;
};

export default function ServantBookingRequests() {
  const {
    data: bookings = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Booking[]>("/booking/AuthRequests", fetcher);

  useEffect(() => {
    const onNewBooking = () => {
      message.info("New booking request received!");
      void mutate();
    };

    bookingSocket.connect();
    bookingSocket.on("booking:new", onNewBooking);

    return () => {
      bookingSocket.off("booking:new", onNewBooking);
    };
  }, [mutate]);

const updateStatus = async ( bookingId: string, status: "accept" | "reject") => {
    try {
      const res = await httpsRequest.patch(`/booking/${status}/${bookingId}`);

      message.success(res.data.message || `Booking ${status}ed`);
      void mutate();
      
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Unable to update booking",
      );
    }
  };

  if (isLoading) {
    return <Spin description="Loading booking requests..." />;
  }

  if (error) {
    return <Text type="danger">Failed to load booking requests.</Text>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div>
        <Title level={3}>Booking Requests</Title>
        <Text type="secondary">
          Review customer requests and accept or reject them.
        </Text>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <Empty description="No pending booking requests" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {bookings.map((booking) => (
            <Card
              key={booking._id}
              className="rounded-2xl shadow-sm"
              title={
                <div className="flex items-center justify-between gap-2">
                  <span>Booking Request</span>
                  <Tag color="gold">{booking.status}</Tag>
                </div>
              }
            >
              <div className="space-y-3">
                <Text strong>
                  Customer: {booking.customerId?.fullname || "Customer"}
                </Text>

                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <Text>{booking.bookingDate}</Text>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <Text>
                    {booking.startTime} - {booking.endTime}
                  </Text>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <Text>
                    {booking.location}, {booking.address}
                  </Text>
                </div>

                <Text>
                  {booking.hours} hours × ₹{booking.hourlyPrice}
                </Text>

                <Title level={5}>Total: ₹{booking.totalAmount}</Title>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="primary"
                    icon={<CheckCircle size={16} />}
                    className="flex-1"
                    onClick={() => updateStatus(booking._id, "accept")}
                  >
                    Accept Booking
                  </Button>

                  <Button
                    danger
                    icon={<XCircle size={16} />}
                    className="flex-1"
                    onClick={() => updateStatus(booking._id, "reject")}
                  >
                    Reject Booking
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
