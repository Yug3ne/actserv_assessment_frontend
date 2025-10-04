import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../api/api-client";
import { toast } from "react-toastify";


const fetchForms = async () => {
  const res = await API.get("api/forms/");
  return res.data;
};

const FormsTable = () => {
    const queryClient = useQueryClient();

    const { data: forms, isLoading } = useQuery({
      queryKey: ["forms"],
      queryFn: fetchForms,
    });
  
    const deleteForm = async (id: string) => {
      const res = await API.delete(`api/forms/${id}/delete/`);
      if (res.status === 204) {
        return id;
      } else {
        throw new Error("Failed to delete form");
      }
    };
  
    const mutation = useMutation({
      mutationFn: deleteForm,
      onSuccess: () => {
        toast.success("Form deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["forms"] }); 
      },
      onError: () => {
        toast.error("Failed to delete form");
      },
    });
  
    const handleDelete = (id: string) => {
      mutation.mutate(id);
    };
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Forms</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms?.map((form: any) => (
            <tr key={form.id} className="border-t">
              <td className="p-2">{form.name}</td>
              <td className="p-2">{form.description}</td>
              <td className="p-2 space-x-2">
                <button className="text-red-500 hover:underline" onClick={() => handleDelete(form.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormsTable;
