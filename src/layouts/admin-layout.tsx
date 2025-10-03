import { Link, NavLink, Outlet, useNavigate } from "react-router";
import useAuthStore from "../lib/authStore";
import API from "../api/api-client";

const AdminLayout = () => {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();


  const handleLogout = async () => {
    const res = await API.post("api/auth/logout/");
    if (res.status === 200) {
      clearUser();
      navigate("/login");
    }
  };

  
  return (
    <div
      className="min-h-dvh grid"
      style={{ gridTemplateColumns: "240px 1fr", gridTemplateRows: "56px 1fr" }}
    >
      <aside className="row-span-2 bg-gray-100 p-4">
        <div className="font-bold text-lg mb-4">
          <Link to="/">Onboarding Admin</Link>
        </div>
        <nav className="space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-primary-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/forms"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-primary-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Forms
          </NavLink>
          <NavLink
            to="/admin/submissions"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-primary-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Submissions
          </NavLink>
          <NavLink
            to="/admin/clients"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-primary-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Clients
          </NavLink>
        </nav>
      </aside>
      <header className="col-start-2 flex items-center justify-end gap-3 px-4 border-b bg-white">
        <div className="text-sm">{user?.email}</div>
        <button
          onClick={handleLogout}
          className="text-sm bg-orange-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </header>
      <main className="col-start-2 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
