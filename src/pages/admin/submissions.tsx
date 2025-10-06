import { useQuery } from "@tanstack/react-query";
import API from "../../api/api-client";

const fetchSubmissions = async () => {
  const res = await API.get("/api/submissions/");
  return res.data;
};

const Submissions = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  if (isLoading) return <div className="p-4">Loading submissions...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load submissions.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Submissions</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {data.map((submission) => (
          <div
            key={submission.id}
            className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-medium mb-2">
              {submission.data.business_name}
            </h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Owner:</strong> {submission.data.owner_full_name}</p>
              <p><strong>ID Number:</strong> {submission.data.id_number}</p>
              <p><strong>Business Type:</strong> {submission.data.business_type}</p>
              <p><strong>Years in Operation:</strong> {submission.data.years_in_operation}</p>
              <p><strong>Employees:</strong> {submission.data.number_of_employees}</p>
              <p><strong>Annual Revenue:</strong> {submission.data.annual_revenue}</p>
              <p><strong>Grant Amount:</strong> {submission.data.grant_amount_requested}</p>
              <p><strong>Purpose:</strong> {submission.data.purpose_of_grant}</p>
              <p><strong>Email:</strong> {submission.data.email}</p>
              <p><strong>Phone:</strong> {submission.data.phone_number}</p>
            </div>

            {submission.files?.length > 0 && (
              <div className="mt-3">
                <strong>Files:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {submission.files.map((file) => (
                    <li key={file.id}>
                      <a
                        href={file.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.file.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">
              Submitted on: {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions;
