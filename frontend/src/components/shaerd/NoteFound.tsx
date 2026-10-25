import React from "react";
import { Button } from "antd";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoteFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-xl text-center">
        <div className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-blue-100 shadow-inner">
          <div className="absolute inset-3 rounded-full border-2 border-dashed border-blue-300 animate-spin [animation-duration:20s]" />
          <SearchX size={64} strokeWidth={1.5} className="text-blue-600" />
          <span className="absolute -right-2 top-2 rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-600 shadow-md">
            404
          </span>
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
          Page Not Found
        </p>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Lost your way?
        </h1>

        <p className="mx-auto mb-8 max-w-md text-base leading-7 text-gray-500 sm:text-lg">
          Oops! The page you're looking for doesn't exist, may have been moved,
          or the link is incorrect.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="primary"
            size="large"
            icon={<Home size={18} />}
            onClick={() => navigate("/")}
            className="h-12! rounded-xl! px-7! font-semibold!"
          >
            Back to Home
          </Button>

          <Button
            size="large"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
            className="h-12! rounded-xl! px-7! font-semibold!"
          >
            Go Back
          </Button>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-400">
            Something went wrong? Try returning to the homepage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteFound;
