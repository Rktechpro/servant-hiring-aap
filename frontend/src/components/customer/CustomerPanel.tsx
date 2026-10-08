import {
  CalendarOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { Card, Col, Row, Statistic } from "antd";

const CustomerPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Customer Dashboard</h1>

        <p className="mt-1 text-gray-500">
          Find servants and manage your bookings.
        </p>
      </div>

      {/* Search */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center rounded-xl border px-4 py-3">
            <SearchOutlined className="mr-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search servant by skill or location..."
              className="w-full outline-none"
            />
          </div>

          <button className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700">
            Search Servants
          </button>
        </div>
      </Card>

      {/* Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={12}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={2}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={8}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Bookings"
              value={2}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Servant list */}
      <Card
        title="Recommended Servants"
        extra={
          <button className="text-sm font-medium text-indigo-600">
            View All
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                  S
                </div>

                <div>
                  <h3 className="font-semibold">Servant {item}</h3>

                  <p className="text-sm text-gray-500">Delhi</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Cooking • Cleaning • House Work
                </p>

                <p className="mt-2 font-semibold text-indigo-600">
                  ₹300 / hour
                </p>
              </div>

              <button className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CustomerPanel;
