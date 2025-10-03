import {Route, Routes } from "react-router"
import AdminLayout from "./layouts/admin-layout"
import ClientLayout from "./layouts/client-layout"
import Dashboard from "./pages/admin/dashboard"
import Submissions from "./pages/admin/submissions"
import Form from "./pages/admin/form"
import Client from "./pages/admin/client"
import FormsList from "./pages/client/forms-list"
import MySubmissions from "./pages/client/my-submissions"
import FormsFill from "./pages/client/forms-fill"
import LoginPage from "./pages/login"

function AppRoutes(){
  return (
    <Routes>
       <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="forms" element={<Form />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="clients" element={<Client />} />
      </Route>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<FormsList />} />
        <Route path="my-submissions" element={<MySubmissions />} />
        <Route path="forms/:id" element={<FormsFill />} />
      </Route>
    </Routes>
  )
}


const App = () => {
  return (
   <AppRoutes />
  )
}

export default App