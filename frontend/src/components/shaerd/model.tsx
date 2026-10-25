import { useState, type ChangeEvent } from "react";
import { Button, Col, Form, Input, Modal, Row, Space} from "antd";
import { Home, MapPin, Save } from "lucide-react";
const { TextArea } = Input;

export interface CustomerProfileForm {
  image?: string;
  addressCustomer: string;
  locationCustomer: string;
}

interface CustomerProfileModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (
    values: CustomerProfileForm,
  ) => void | Promise<void>;
  initialValues?: Partial<CustomerProfileForm>;
  mode: "create" | "edit";
}

const CustomerProfileModal = ({open,loading = false,onCancel,onSubmit,initialValues,mode,}: CustomerProfileModalProps) => {
  const [formData, setFormData] = useState<CustomerProfileForm>({
    image: "",
    locationCustomer: "",
    addressCustomer: "",
  });

  const isEdit = mode === "edit";

  const handleInput = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev,[name]: value}));
  };

  const handleFinish = async () => {
    if (
      !formData.locationCustomer ||
      !formData.addressCustomer
    ) {
      return;
    }

    await onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData({
      image: "",
      locationCustomer: "",
      addressCustomer: "",
    });

    onCancel();
  };

  const handleOpen = () => {
    setFormData({
      image: initialValues?.image || "",
      locationCustomer: initialValues?.locationCustomer || "",
      addressCustomer: initialValues?.addressCustomer || "",
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Home size={20} />
          <span>
            {isEdit
              ? "Edit Customer Profile"
              : "Create Customer Profile"}
          </span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      afterOpenChange={(visible) => {
        if (visible) handleOpen();
      }}
      footer={null}
      width={650}
      centered
      destroyOnHidden
    >
      <Form
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
              required
            >
              <Input
                name="locationCustomer"
                value={formData.locationCustomer}
                onChange={handleInput}
                size="large"
                placeholder="e.g. Meerut"
              />
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
              required
            >
              <TextArea
                name="addressCustomer"
                value={formData.addressCustomer}
                onChange={handleInput}
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
            <Button onClick={handleCancel}>
              Cancel
            </Button>

            <Button
              type="primary"
              onClick={handleFinish}
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

export default CustomerProfileModal;
