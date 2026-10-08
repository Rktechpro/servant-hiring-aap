import { useEffect } from "react";
import { Button, Col, Form, Input, Modal, Row, Space } from "antd";
import { Home, MapPin, Save } from "lucide-react";

const { TextArea } = Input;

export interface CustomerProfileForm {
  image?: string;
  location: string;
  address: string;
}

interface CustomerProfileModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: CustomerProfileForm) => void | Promise<void>;
  initialValues?: Partial<CustomerProfileForm>;
  mode: "create" | "edit";
}

const CustomerProfileModal = ({
  open,
  loading = false,
  onCancel,
  onSubmit,
  initialValues,
  mode,
}: CustomerProfileModalProps) => {
  const [form] = Form.useForm<CustomerProfileForm>();

  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        image: initialValues?.image || "",
        location: initialValues?.location || "",
        address: initialValues?.address || "",
      });
    }
  }, [open, initialValues, form]);

  const handleFinish = async (values: CustomerProfileForm) => {
    await onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Home size={20} />
          <span>
            {isEdit ? "Edit Customer Profile" : "Create Customer Profile"}
          </span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={650}
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
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Location</span>
                </div>
              }
              name="location"
              rules={[
                {
                  required: true,
                  message: "Please enter your location",
                },
              ]}
            >
              <Input size="large" placeholder="e.g. Delhi" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <Home size={16} />
                  <span>Address</span>
                </div>
              }
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please enter your address",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Enter your complete address"
                maxLength={300}
                showCount
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
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<Save size={17} />}
            >
              {isEdit ? "Save" : "Create Profile"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerProfileModal;
