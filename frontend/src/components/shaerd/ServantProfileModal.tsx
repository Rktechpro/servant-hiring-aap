import { useState, type ChangeEvent } from "react";
import {Button,Col,Form,Input,InputNumber,Modal,Row,Select,Space,Switch} from "antd";
import {UserRound,MapPin,MapPinned,Save,IndianRupee,CalendarDays} from "lucide-react";

const { TextArea } = Input;

export interface ServantProfileForm {
  image?: string;
  bio: string;
  skills: string[];
  servantAddress: string;
  servantlocation: string;
  hourlyPrice: number;
  availability: boolean;
}

interface ServantProfileModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: ServantProfileForm) => void | Promise<void>;
  mode: "create" | "edit";
}

export const ServantProfileModal = ({open,loading = false,onCancel,onSubmit,mode,
}: ServantProfileModalProps) => {

  const [formData, setFormData] = useState<ServantProfileForm>({
    bio: "",
    skills: [],
    servantlocation: "",
    servantAddress: "",
    hourlyPrice: 0,
    availability: true,
    image: "",
  });

  const isEdit = mode === "edit";

const handleInput = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (
      !formData.bio.trim() ||
      !formData.servantlocation.trim() ||
      !formData.servantAddress.trim() ||
      formData.skills.length === 0 ||
      formData.hourlyPrice < 1
    ) {
      return;
    }

    await onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData({
      bio: "",
      skills: [],
      servantlocation: "",
      servantAddress: "",
      hourlyPrice: 0,
      availability: true,
      image: "",
    });

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
      <Form layout="vertical" className="pt-4">
        <Row gutter={16}>
          {/* Bio */}
          <Col xs={24}>
            <Form.Item label="About Me" required>
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleInput}
                rows={3}
                maxLength={500}
                showCount
                placeholder="Describe your experience and services"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Skills" required>
              <Select
                mode="tags"
                size="large"
                value={formData.skills}
                onChange={(skills: string[]) =>
                  setFormData((prev) => ({
                    ...prev,
                    skills,
                  }))
                }
                placeholder="Type a skill and press Enter"
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>
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
                name="servantlocation"
                value={formData.servantlocation}
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
                  <IndianRupee size={16} />
                  <span>Hourly Price (₹)</span>
                </div>
              }
              required
            >
              <InputNumber
                min={1}
                size="large"
                className="w-full"
                value={formData.hourlyPrice || undefined}
                onChange={(hourlyPrice) =>
                  setFormData((prev) => ({
                    ...prev,
                    hourlyPrice: hourlyPrice ?? 0,
                  }))
                }
                placeholder="e.g. 250"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <MapPinned size={16} />
                  <span>Full Address</span>
                </div>
              }
              required
            >
              <TextArea
                name="servantAddress"
                value={formData.servantAddress}
                onChange={handleInput}
                rows={3}
                maxLength={300}
                showCount
                placeholder="Enter your complete address"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <span>Available for Bookings</span>
                </div>
              }
            >
              <Switch
                checked={formData.availability}
                onChange={(availability) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability,
                  }))
                }
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
            <Button onClick={handleCancel}>
              Cancel
            </Button>

            <Button
              type="primary"
              onClick={handleSave}
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

