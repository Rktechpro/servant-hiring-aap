import { useState } from "react";
import {
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Input,
  Button,
  InputNumber,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

interface BookingFormValues {
  bookingDate: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  location: string;
  address: string;
}

interface BookingModalProps {
  open: boolean;
  servantId: string;
  onClose: () => void;
  onSubmit: (data: {
    servantId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    hours: number;
    location: string;
    address: string;
  }) => void;
}

export default function BookingModal({
  open,
  servantId,
  onClose,
  onSubmit,
}: BookingModalProps) {
  const [form] = Form.useForm<BookingFormValues>();
  const [hours, setHours] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const calculateHours = (start?: Dayjs, end?: Dayjs) => {
    if (!start || !end) {
      setHours(0);
      return;
    }

    const startMinutes = start.hour() * 60 + start.minute();
    const endMinutes = end.hour() * 60 + end.minute();
    const difference = endMinutes - startMinutes;

    setHours(difference > 0 ? difference / 60 : 0);
  };

  const handleFinish = async (values: BookingFormValues) => {
    if (!servantId) {
      message.error("Servant ID is missing");
      return;
    }

    const startMinutes =
      values.startTime.hour() * 60 + values.startTime.minute();

    const endMinutes = values.endTime.hour() * 60 + values.endTime.minute();

    if (endMinutes <= startMinutes) {
      message.error("End time must be after start time");
      return;
    }

    const calculatedHours = (endMinutes - startMinutes) / 60;

    const payload = {
      servantId,
      bookingDate: values.bookingDate.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
      hours: calculatedHours,
      location: values.location,
      address: values.address,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      form.resetFields();
      setHours(0);
      onClose();
    } catch {
      message.error("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Book a Servant"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          bookingDate: dayjs(),
        }}
      >
        <Form.Item
          label="Booking Date"
          name="bookingDate"
          rules={[{ required: true, message: "Please select booking date" }]}
        >
          <DatePicker
            className="w-full"
            format="YYYY-MM-DD"
            disabledDate={(date) => date.isBefore(dayjs(), "day")}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[{ required: true, message: "Select start time" }]}
          >
            <TimePicker
              className="w-full"
              format="HH:mm"
              minuteStep={30}
              onChange={(value) =>
                calculateHours(
                  value ?? undefined,
                  form.getFieldValue("endTime"),
                )
              }
            />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="endTime"
            rules={[{ required: true, message: "Select end time" }]}
          >
            <TimePicker
              className="w-full"
              format="HH:mm"
              minuteStep={30}
              onChange={(value) =>
                calculateHours(
                  form.getFieldValue("startTime"),
                  value ?? undefined,
                )
              }
            />
          </Form.Item>
        </div>

        <Form.Item label="Total Hours">
          <InputNumber
            className="w-full"
            value={hours}
            readOnly
            suffix="hours"
          />
        </Form.Item>

        <Form.Item
          label="Location / City"
          name="location"
          rules={[{ required: true, message: "Please enter your location" }]}
        >
          <Input placeholder="e.g. Delhi" />
        </Form.Item>

        <Form.Item
          label="Full Address"
          name="address"
          rules={[
            { required: true, message: "Please enter your full address" },
          ]}
        >
          <Input.TextArea
            placeholder="e.g. Sector 15, Rohini, Delhi"
            rows={3}
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Confirm Booking
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
