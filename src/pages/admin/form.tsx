import { useState, useEffect, useMemo } from "react";
import API from "../../api/api-client";
import { toast } from "react-toastify";
import FormsTable from "../../components/form-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FieldType = "text" | "number" | "file" | "textarea" | "select";

type Field = {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  choices?: string[];
};

const FormBuilder = () => {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [required, setRequired] = useState(false);
  const [choices, setChoices] = useState("");
  const [jsonPreview, setJsonPreview] = useState("");

  const queryClient = useQueryClient();

  const addField = () => {
    if (!label || !name) return;
    const newField: Field = {
      name,
      label,
      type,
      required,
      ...(type === "select" && choices
        ? { choices: choices.split(",").map((c) => c.trim()) }
        : {}),
    };
    setFields((prev) => [...prev, newField]);

    setLabel("");
    setName("");
    setType("text");
    setRequired(false);
    setChoices("");
  };

  const payload = useMemo(
    () => ({
      name: formName,
      description: formDescription,
      fields,
      schema_version: 1,
    }),
    [formName, formDescription, fields]
  );

  

  useEffect(() => {
    setJsonPreview(JSON.stringify(payload, null, 2));
  }, [payload]);

  const createFormMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("api/forms/create/", formData);
      if (res.status !== 201) throw new Error("Failed to create form");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Form created successfully!");
      queryClient.invalidateQueries({ queryKey: ["forms"] }); // refresh table
    },
    onError: (err: Error) => {
      //@ts-expect-error - err is any
      toast.error(err.response?.data?.detail || "Error creating form");
    },
  });

  const handleSubmit = () => {
    try {
      const finalPayload = JSON.parse(jsonPreview);
      createFormMutation.mutate(finalPayload);
    } catch (err: unknown) {
      console.error(err);
      //@ts-expect-error - err is unzzzzzzzknown
      toast.error(err.message || "Error creating form");
    }
    
  };
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-lg">Form Setup</h2>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            onBlur={() => setJsonPreview(JSON.stringify(payload, null, 2))}
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Form Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            onBlur={() => setJsonPreview(JSON.stringify(payload, null, 2))}
          />

          <h3 className="font-semibold">Add Field</h3>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Field Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Field Name (e.g. loan_amount)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
            <option value="file">File Upload</option>
          </select>
          {type === "select" && (
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Choices (comma separated)"
              value={choices}
              onChange={(e) => setChoices(e.target.value)}
            />
          )}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            <span>Required</span>
          </label>
          <button
            onClick={() => {
              addField();
              setJsonPreview(JSON.stringify(payload, null, 2));
            }}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Add Field
          </button>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold text-lg">Editable JSON Preview</h2>
          <textarea
            className="w-full h-96 bg-gray-50 p-3 rounded text-xs font-mono"
            value={jsonPreview}
            onChange={(e) => setJsonPreview(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="mt-4 bg-orange-500 text-white px-3 py-2 rounded"
          >
            Save Form
          </button>
        </div>
      </div>
      <FormsTable />
    </>
  );
};

export default FormBuilder;
