import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Toast } from "./components/Toast";
import { useApp } from "./context/AppContext";

import { Home } from "./pages/Home";
import { Conditions } from "./pages/Conditions";
import { BookAppointment } from "./pages/BookAppointment";
import { VideoConsult } from "./pages/VideoConsult";
import { Medicines } from "./pages/Medicines";
import { Records } from "./pages/Records";

export const App: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <>
      <Toast message={toastMessage} />
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/consult" element={<VideoConsult />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/records" element={<Records />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </>
  );
};

export default App;

