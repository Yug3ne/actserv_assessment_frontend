import { Navigate, Route, Routes } from "react-router";
import AdminLayout from "./layouts/admin-layout";
import ClientLayout from "./layouts/client-layout";
import Dashboard from "./pages/admin/dashboard";
import Submissions from "./pages/admin/submissions";
import Form from "./pages/admin/form";
import Client from "./pages/admin/client";
import FormsList from "./pages/client/forms-list";
import MySubmissions from "./pages/client/my-submissions";
import FormsFill from "./pages/client/forms-fill";
import LoginPage from "./pages/login";
import useAuthStore from "./lib/authStore";
import { ToastContainer } from "react-toastify";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  if (user && isAuthenticated) {
    return user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return <>{children}</>;
}

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isAuthenticated } = useAuthStore();

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="forms" element={<Form />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="clients" element={<Client />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FormsList />} />
        {/* <Route path="my-submissions" element={<MySubmissions />} /> */}
        <Route path="forms/:id" element={<FormsFill />} />
      </Route>
    </Routes>
  );
}

const App = () => {
  return (<>
  <AppRoutes />
  <ToastContainer autoClose={1500} />
  </>)
};

export default App;
