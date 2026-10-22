import { useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
} from "antd";
import {
  UserRound,
  MapPin,
  Save,
  BriefcaseBusiness,
  IndianRupee,
  CalendarDays,
} from "lucide-react";

const { TextArea } = Input;

export interface ServantProfileForm {
  image?: string;
  bio: string;
  skills: string[];
  location: string;
  hourlyPrice: number;
  availability: boolean;
}

interface ServantProfileModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: ServantProfileForm) => void | Promise<void>;
  initialValues?: Partial<ServantProfileForm>;
  mode: "create" | "edit";
}

const ServantProfileModal = ({
  open,
  loading = false,
  onCancel,
  onSubmit,
  initialValues,
  mode,
}: ServantProfileModalProps) => {
  const [form] = Form.useForm<ServantProfileForm>();

  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        image: initialValues?.image || "",
        bio: initialValues?.bio || "",
        skills: initialValues?.skills || [],
        location: initialValues?.location || "",
        hourlyPrice: initialValues?.hourlyPrice,
        availability: initialValues?.availability ?? true,
      });
    }
  }, [open, initialValues, form]);

  const handleFinish = async (values: ServantProfileForm) => {
    await onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserRound size={20} />
          <span>
            {isEdit ? "Edit Servant Profile" : "Create Servant Profile"}
          </span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-4"
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="bio"
              label="About Me"
              rules={[
                { required: true, message: "Please enter your bio" },
                { max: 500, message: "Bio cannot exceed 500 characters" },
              ]}
            >
              <TextArea
                rows={3}
                maxLength={500}
                showCount
                placeholder="Describe your experience and services"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="skills"
              label={
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness size={16} />
                  <span>Skills</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  type: "array",
                  min: 1,
                  message: "Please add at least one skill",
                },
              ]}
            >
              <Select
                mode="tags"
                size="large"
                placeholder="Type a skill and press Enter"
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="location"
              label={
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Location</span>
                </div>
              }
              rules={[
                { required: true, message: "Please enter your location" },
              ]}
            >
              <Input size="large" placeholder="e.g. Delhi" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="hourlyPrice"
              label={
                <div className="flex items-center gap-2">
                  <IndianRupee size={16} />
                  <span>Hourly Price (₹)</span>
                </div>
              }
              rules={[{ required: true, message: "Please enter hourly price" }]}
            >
              <InputNumber
                min={1}
                size="large"
                className="w-full"
                placeholder="e.g. 250"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="availability"
              label={
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <span>Available for Bookings</span>
                </div>
              }
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Available"
                unCheckedChildren="Unavailable"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleCancel}>Cancel</Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<Save size={17} />}
            >
              {isEdit ? "Save Changes" : "Create Profile"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServantProfileModal;
