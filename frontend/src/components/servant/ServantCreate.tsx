import { useState } from "react";
import { Button, Card, message } from "antd";
import { Plus, PlusCircle } from "lucide-react";
import { mutate } from "swr";

import { httpsRequest } from "../../lib/http";
import { ServantProfileModal } from "../shaerd/ServantProfileModal";


interface ServantFormData {
  bio?: string;
  skills?: string[] | string;
  location?: string;
  hourlyPrice?: number;
  availability?: boolean;
  isActive?: boolean;
}

const ServantCreate = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (values: ServantFormData) => {
    setLoading(true);

    try {
      const createResponse = await httpsRequest.post("/servant/createServant", values);
      try {
        await httpsRequest.post("/servant/generate-embeddings");
        message.success("Servant profile created and indexed successfully");
      } 
      catch (embeddingError) {
        message.warning( "Profile created, but search indexing failed. Please retry indexing.",
        );
      }

      setResponse(createResponse);
      setOpen(false);
      await mutate("/servant");
      
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to create servant profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card className="rounded-3xl! border-0! shadow-sm">
        <div className="py-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
            <PlusCircle size={40} className="text-indigo-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Complete your servant profile
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Add your skills, experience, location and hourly price so customers
            can discover and book your services.
          </p>

          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            className="mt-6 rounded-xl!"
            onClick={() => setOpen(true)}
          >
            Create Servant Profile
          </Button>
        </div>
      </Card>

      <ServantProfileModal
        open={open}
        loading={loading}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      
        mode={response ? "edit" : "create"}
      />
    </div>
  );
};

export default ServantCreate;
