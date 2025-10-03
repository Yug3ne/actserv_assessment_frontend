import { useState } from "react";
import { useNavigate } from "react-router";
import API from "../api/api-client";
import useAuthStore from "../lib/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser} = useAuthStore();
 

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try{
        setLoading(true);
        setError(null);
        const response = await API.post("api/auth/login/", { email, password });
        
        if(response.status === 200){
            const data = await API.get("api/user/");
            setUser(data.data);
            navigate("/");
        }
    }
    catch(err){
        // @ts-expect-error - err is any
        setError(err.response?.data.detail || "Invalid credentials");
    }
    finally{
        setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh grid place-items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        {error ? (
          <div className="mb-3 text-red-600 text-sm">{error}</div>
        ) : null}
        <label className="block mb-2 text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />
        <label className="block mb-2 text-sm">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 text-white rounded py-2 hover:brightness-95 active:brightness-90 transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
