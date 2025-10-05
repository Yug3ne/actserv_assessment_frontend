import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import API from "../../api/api-client";
import { toast } from "react-toastify";

const fetchForm = async (id: string): Promise<any> => {
  const res = await API.get(`api/forms/${id}/`);
  return res.data;
};

const submitForm = async (payload: FormData) => {
  const res = await API.post("api/forms/submit/", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const FormsFill = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(0);

  const navigate = useNavigate();

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", id],
    queryFn: () => fetchForm(id!),
  });

  const mutation = useMutation({
    mutationFn: submitForm,
    onSuccess: () => {
      toast.success("Form submitted successfully!");
      navigate("/my-submissions");
    },
    onError: () => {
      toast.error("Failed to submit form.");
    },
  });

  if (isLoading) return <p>Loading form...</p>;
  if (!form) return <p>Form not found.</p>;

  const isMultiStep = form.fields.length > 7;
  const fieldsPerStep = 7;
  const totalSteps = isMultiStep
    ? Math.ceil(form.fields.length / fieldsPerStep)
    : 1;

  const startIndex = step * fieldsPerStep;
  const visibleFields = isMultiStep
    ? form.fields.slice(startIndex, startIndex + fieldsPerStep)
    : form.fields;

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = () => {
    const formPayload = new FormData();
    formPayload.append("form", id!);
    formPayload.append("data", JSON.stringify(formData));

    files.forEach((file) => {
      formPayload.append("files", file);
    });

    mutation.mutate(formPayload);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">{form.name}</h2>
      <p className="text-gray-500 mb-6">{form.description}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isMultiStep && step < totalSteps - 1) {
            setStep((prev) => prev + 1);
          } else {
            handleSubmit();
          }
        }}
      >
        {visibleFields.map((field: any) => (
          <div key={field.name} className="mb-4">
            <label className="block font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "text" || field.type === "number" || field.type === "email"  ? (
              <input
                type={field.type}
                required={field.required}
                className="w-full border px-3 py-2 rounded"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : field.type === "textarea" ? (
              <textarea
                required={field.required}
                className="w-full border px-3 py-2 rounded"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : field.type === "select" ? (
              <select
                required={field.required}
                className="w-full border px-3 py-2 rounded"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              >
                <option value="">Select...</option>
                {field.choices?.map((choice: any) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            ) : field.type === "file" ? (
              <input
                type="file"
                multiple
                required={field.required}
                className="w-full border px-3 py-2 rounded"
                onChange={handleFileChange}
              />
            ) : null}
          </div>
        ))}

        {isMultiStep && (
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Back
            </button>

            <div className="flex-1 text-center text-sm text-gray-600">
              Step {step + 1} of {totalSteps}
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={mutation.isPending}
            >
              {isMultiStep && step < totalSteps - 1 ? "Next" : "Submit"}
            </button>
          </div>
        )}

        {!isMultiStep && (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
            disabled={mutation.isPending}
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default FormsFill;
