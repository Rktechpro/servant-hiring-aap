import { Button, Card } from "antd";
import { Plus, PlusCircle } from "lucide-react";

import { useState } from "react";
import { httpsRequest } from "../../lib/http";
import CustomerProfileModal from "../shaerd/model";
import { mutate } from "swr";

const Createprofile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const respose = await httpsRequest.post(
        "/customer/createCustomer",
        values,
      );
      mutate("/customer");
      setResponse(respose);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="mx-auto max-w-4xl p-6">
        <Card className="rounded-3xl! border-0! shadow-sm">
          <div className="py-12 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
              <PlusCircle className="text-3xl! text-indigo-600!" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Complete your profile
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Create your candidate profile to showcase your skills, experience,
              education and resume to recruiters.
            </p>

            <Button
              type="primary"
              size="large"
              icon={<Plus />}
              className="mt-6 rounded-xl!"
              onClick={() => setOpen(true)}
            >
              Create Profile
            </Button>
          </div>
        </Card>
      </div>
      <CustomerProfileModal
        open={open}
        loading={loading}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
        initialValues={response?.data}
        mode={response ? "edit" : "create"}
      />
    </>
  );
};

export default Createprofile;
