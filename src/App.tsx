import React  from "react";
import { Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import "./index.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from "./redux/store";


const App: React.FC = () => {
  

  return (
    <>
    <PersistGate loading={null} persistor={persistor}>
    <Routes>
     <Route path="/*" element={<UserRoutes />} />
    </Routes>
    </PersistGate>
      <Toaster />
      <ToastContainer />
    </>
  );
};

export default App;
