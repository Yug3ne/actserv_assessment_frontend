import { Link, Outlet } from "react-router";
import useAuthStore from "../lib/authStore";
import { useNavigate } from "react-router";

const ClientLayout = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();

    return (
      <div className="min-h-dvh flex flex-col">
        <nav className="h-14 flex items-center justify-between px-4 border-b bg-white">
          <Link to="/" className="font-semibold">
            Onboarding
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span>{user?.email}</span>
            <button
              onClick={() => {
                clearUser();
                navigate("/login");
              }}
              className="bg-orange-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </nav>
        <main className="flex-1 grid place-items-center p-4">
          <div className="w-full max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    );
}

export default ClientLayout