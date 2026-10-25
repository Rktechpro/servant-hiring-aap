import { useState } from "react";
import { Modal, Form, DatePicker, TimePicker, Input, Button, InputNumber, message} from "antd";
import dayjs, { type Dayjs } from "dayjs";

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
  customer?: {
    location?: string;
    address?: string;
  };
  onClose: () => void;
  onSubmit: (data: {
    servantId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    hours: number;
    location: string;
    address: string;
  }) => void | Promise<void>;
}

export const BookingModal=({open,servantId,customer,onClose,onSubmit}: BookingModalProps)=> {
  const [form] = Form.useForm<BookingFormValues>();
  const [hours, setHours] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleModalOpen = (visible: boolean) => {
    if (visible) {
      form.setFieldsValue({
        bookingDate: dayjs(),
        location: customer?.location ?? "",
        address: customer?.address ?? "",
      });
      setHours(0);
    }
  };

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

    const startMinutes = values.startTime.hour() * 60 + values.startTime.minute();
    const endMinutes =values.endTime.hour() * 60 + values.endTime.minute();

    if (endMinutes <= startMinutes) {
      message.error("End time must be after start time");
      return;
    }

    const calculatedHours = (endMinutes - startMinutes) / 60;

    if (calculatedHours < 1) {
      message.error("Minimum booking duration is 1 hour");
      return;
    }

    const payload = {
      servantId,
      bookingDate: values.bookingDate.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
      hours: calculatedHours,
      location: values.location.trim(),
      address: values.address.trim(),
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      message.success("Booking request submitted");
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
      afterOpenChange={handleModalOpen}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Booking Date"
          name="bookingDate"
          rules={[
            {
              required: true,
              message: "Please select booking date",
            },
          ]}
        >
          <DatePicker
            className="w-full"
            format="YYYY-MM-DD"
            disabledDate={(date) =>
              date.isBefore(dayjs(), "day")
            }
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[
              {
                required: true,
                message: "Select start time",
              },
            ]}
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
            rules={[
              {
                required: true,
                message: "Select end time",
              },
            ]}
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
            value={hours || undefined}
            readOnly
            suffix="hours"
            placeholder="Calculated automatically"
          />
        </Form.Item>

        <Form.Item
          label="Location / City"
          name="location"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please enter your location",
            },
          ]}
        >
          <Input placeholder="Your city" />
        </Form.Item>

        <Form.Item
          label="Full Address"
          name="address"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please enter your full address",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Your complete address"
            rows={3}
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            Confirm Booking
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

