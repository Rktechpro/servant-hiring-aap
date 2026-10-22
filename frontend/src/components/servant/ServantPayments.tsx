import useSWR from "swr";
import { Card, Table, Tag, Typography, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IndianRupee, Wallet } from "lucide-react";
import { fetchUrl } from "../../lib/fetch";

const { Title, Text } = Typography;

interface Booking {
  _id: string;
  paymentStatus?: "PENDING" | "COMPLETED" | "FAILED" | "PAID";
  totalAmount?: number;
  paymentAmount?: number;
  createdAt?: string;

  customerFullname?: string;
  customerMobile?: string;

  servantFullname?: string;
  servantMobile?: string;
}

interface BookingResponse {
  success: boolean;
  data: Booking[];
}

const ServantPayments = () => {
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR<Booking[] | BookingResponse>("/booking/my-bookings", fetchUrl);

  const booking: Booking[] = Array.isArray(response)
    ? response
    : (response?.data ?? []);

  console.log("Bookings:", booking);

  const completedBookings = booking.filter(
    (item) => item.paymentStatus === "PAID",
  );

  const totalEarnings = completedBookings.reduce(
    (total, item) => total + (item.totalAmount ?? item.paymentAmount ?? 0),
    0,
  );

  const columns: ColumnsType<Booking> = [
    {
      title: "Booking ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => id?.slice(-8) ?? "-",
    },
    {
      title: "Customer Name",
      dataIndex: ["customer", "fullname"],
      key: "customerFullname",
    },
    {
      title: "Customer Mobile",
      dataIndex: ["customer", "mobile"],
      key: "customerMobile",
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_, record) => (
        <Text strong>
          ₹
          {(record.totalAmount ?? record.paymentAmount ?? 0).toLocaleString(
            "en-IN",
          )}
        </Text>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag
          color={
            status === "PAID" || status === "COMPLETED"
              ? "success"
              : status === "PENDING"
                ? "warning"
                : "error"
          }
        >
          {status ?? "UNPAID"}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "-",
    },
  ];

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to fetch bookings"
        action={<button onClick={() => mutate()}>Retry</button>}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Title level={2}>My Earnings</Title>

        <Card className="rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-green-100 p-4">
              <Wallet size={30} className="text-green-600" />
            </div>

            <div>
              <Text type="secondary">Total Earnings (PAID)</Text>
              <div className="flex items-center text-3xl font-bold">
                <IndianRupee size={25} />
                {totalEarnings.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <Title level={4}>Booking Payment History</Title>

          <Table<Booking>
            rowKey="_id"
            columns={columns}
            dataSource={booking}
            loading={isLoading}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 850 }}
            locale={{ emptyText: "No bookings found" }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ServantPayments;
