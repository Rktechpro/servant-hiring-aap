import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import { Card, Col, Row, Statistic } from "antd";

const ServantPanel = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Servant Dashboard</h1>

        <p className="mt-1 text-gray-500">
          Manage your profile, bookings and earnings.
        </p>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={24}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Requests"
              value={5}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={18}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Earnings"
              value={18500}
              prefix={<DollarOutlined />}
              suffix="₹"
            />
          </Card>
        </Col>
      </Row>

      {/* Booking section */}
      <Card
        title="Recent Booking Requests"
        extra={
          <button className="text-sm font-medium text-indigo-600">
            View All
          </button>
        }
      >
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-col justify-between gap-4 rounded-xl border p-4 md:flex-row md:items-center"
            >
              <div>
                <h3 className="font-semibold">Customer #{item}</h3>

                <p className="text-sm text-gray-500">
                  Delhi • 10:00 AM - 02:00 PM
                </p>

                <p className="mt-1 text-sm">₹300/hour</p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white">
                  Accept
                </button>

                <button className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-500">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ServantPanel;
