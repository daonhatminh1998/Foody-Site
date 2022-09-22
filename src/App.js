import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./customer/containers/DefaultLayout";
import Admin from "./admin/Admin";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<DefaultLayout />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
}

export default App;
