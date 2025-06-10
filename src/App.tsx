import React  from "react";
import { Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import "./index.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  

  return (
    <>
    <Routes>
     <Route path="/*" element={<UserRoutes />} />
    </Routes>
      <Toaster />
      <ToastContainer />
    </>
  );
};

export default App;
