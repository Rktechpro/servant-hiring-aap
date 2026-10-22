import { useEffect } from "react";
import useSWR from "swr";
import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Spin,
  Statistic,
  Tag,
  Typography,
  message,
} from "antd";
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";
import moment from "moment";
import { bookingSocket } from "../../lib/bookingSocket";
import { fetchUrl } from "../../lib/fetch";
import { httpsRequest } from "../../lib/http";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";

const { Title, Text } = Typography;

interface Booking {
  _id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalAmount: number;
  location: string;
  address: string;
  status: string;
  servantId?: {
    bio?: string;
    location?: string;
  };
  paymentStatus: string;
}

interface BookingResponse {
  success?: boolean;
  data?: Booking[];
  bookings?: Booking[];
}

const statusColor: Record<string, string> = {
  PENDING: "gold",
  ACCEPTED: "green",
  REJECTED: "red",
  CANCELLED: "default",
  COMPLETED: "blue",
};

const ENV = import.meta.env;

export const CustomerPanel = () => {
  const { Razorpay } = useRazorpay();
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR<Booking[] | BookingResponse>("/booking/my-bookings", fetchUrl);

  const booking = Array.isArray(response) ? response : (response?.data ?? []);

  useEffect(() => {
    const onBookingStatus = (payload: {
      bookingId: string;
      status: string;
      message?: string;
    }) => {
      message.info(payload.message || `Booking status: ${payload.status}`);
      void mutate();
    };

    bookingSocket.connect();
    bookingSocket.on("booking:status", onBookingStatus);

    return () => {
      bookingSocket.off("booking:status", onBookingStatus);
    };
  }, [mutate]);

  if (isLoading) {
    return <Spin description="Loading your bookings..." />;
  }

  if (error) {
    return <Text type="danger">Failed to load your bookings.</Text>;
  }

  const pendingCount = booking.filter(
    (item) => item.status === "PENDING",
  ).length;

  const completedCount = booking.filter(
    (item) => item.paymentStatus === "PAID",
  ).length;

  const activeCount = booking.filter(
    (item) => item.status === "ACCEPTED" || item.status === "PENDING",
  ).length;

  const paymenthandle = async (bookingId: string) => {
    try {
      console.log(bookingId);
      const { data } = await httpsRequest.post(
        `/payment/create-order/${bookingId}`,
      );
      const payment = data.data;
      console.log(payment);
      const options: RazorpayOrderOptions = {
        key: ENV.VITE__RAZORPAY_KEY_ID!,
        amount: payment.amount,
        currency: ENV.VITE_CURRENCY!,
        order_id: payment.razorpayOrderId,
        name: "Servant Hiring",
        description: "Booking payment",
        handler: (data) => {
          console.log(data);
        },
      };
      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (data) => {
        console.log("payment failid", data);
      });
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Customer Dashboard
          </h1>
          <p className="mt-1 text-gray-500">
            Find servants and manage your bookings.
          </p>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Bookings"
                value={booking.length}
                prefix={<Calendar size={18} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending"
                value={pendingCount}
                prefix={<Clock size={18} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Completed"
                value={completedCount}
                prefix={<CheckCircle size={18} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Bookings"
                value={activeCount}
                prefix={<Calendar size={18} />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Title level={3}>My Bookings</Title>

      {booking.length === 0 ? (
        <Card>
          <Empty description="You have no bookings yet" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {booking.map((item) => (
            <Card
              key={item._id}
              className="rounded-2xl shadow-sm"
              title={
                <div className="flex items-center justify-between gap-2">
                  <span>Booking Details</span>
                  <Tag color={statusColor[item.status] || "default"}>
                    {item.status}
                  </Tag>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <Text>
                    {moment(item.bookingDate).isValid()
                      ? moment(item.bookingDate).format("DD MMM YYYY")
                      : item.bookingDate}
                  </Text>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <Text>
                    {item.startTime} – {item.endTime}
                  </Text>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <Text>
                    {item.location}, {item.address}
                  </Text>
                </div>

                <Title level={5}>Total: ₹{item.totalAmount}</Title>

                {item.status === "PENDING" && (
                  <Text type="secondary">
                    Waiting for the servant to respond.
                  </Text>
                )}

                {item.status === "ACCEPTED" && (
                  <div className="space-y-3">
                    <Text type="success">Your booking has been accepted!</Text>

                    {item.paymentStatus === "PAID" ? (
                      <Card className="border-green-200 bg-green-50">
                        <div className="flex items-center gap-3">
                          <CheckCircle size={24} className="text-green-600" />

                          <div>
                            <Text strong className="text-green-700">
                              Payment Completed
                            </Text>
                            <br />
                            <Text type="secondary">
                              Payment of ₹{item.totalAmount} received
                              successfully.
                            </Text>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Button
                        type="primary"
                        block
                        onClick={() => paymenthandle(item._id)}
                      >
                        Pay Now ₹{item.totalAmount}
                      </Button>
                    )}
                  </div>
                )}

                {item.status === "REJECTED" && (
                  <Text type="danger">Your booking has been rejected.</Text>
                )}

                {item.status === "COMPLETED" && (
                  <Text type="success">Booking completed successfully.</Text>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
