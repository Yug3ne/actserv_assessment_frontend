import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import API from "../../api/api-client";


const fetchForms = async (): Promise<any> => {
  const res = await API.get("api/forms/");
  return res.data;
};

const FormsList = () => {
  const { data: forms, isLoading, isError } = useQuery({
    queryKey: ["forms"],
    queryFn: fetchForms,
  });

  if (isLoading) return <p>Loading forms...</p>;
  if (isError) return <p>Failed to load forms.</p>;
  
  return (
    <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms?.map((form) => (
        <Link
          to={`/forms/${form.id}`}
          key={form.id}
          className="border rounded-xl p-4 hover:shadow-lg transition bg-white"
        >
          <h2 className="text-lg font-semibold mb-2">{form.name}</h2>
          <p className="text-gray-600 text-sm">{form.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default FormsList;
