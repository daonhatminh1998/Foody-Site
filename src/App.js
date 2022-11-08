import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./containers/DefaultLayout";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<DefaultLayout />} />
    </Routes>
  );
}

export default App;
