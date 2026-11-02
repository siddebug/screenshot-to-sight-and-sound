import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role, MedicineOrder, Appointment, PatientReport, Prescription } from "../types";
import { INITIAL_PRESCRIPTION, INITIAL_QUEUE, INITIAL_REPORTS } from "../data/mockData";

export type DoctorTab = "queue" | "patients" | "dispatch" | "settings";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  doctorTab: DoctorTab;
  setDoctorTab: (tab: DoctorTab) => void;
  orders: MedicineOrder[];
  addOrder: (order: MedicineOrder) => void;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  reports: PatientReport[];
  addReport: (report: PatientReport) => void;
  prescription: Prescription;
  updatePrescription: (prescription: Prescription) => void;
  fees: { comprehensive: number; followUp: number };
  updateFees: (fees: { comprehensive: number; followUp: number }) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "medicate_standalone_v1";

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>("patient");
  const [doctorTab, setDoctorTab] = useState<DoctorTab>("queue");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [orders, setOrders] = useState<MedicineOrder[]>([
    {
      id: "ORD-7731",
      remedies: ["Pulsatilla 200", "Arnica Montana 30C", "Natrum Mur 6X"],
      courier: "bluedart",
      awb: "BD849201928IN",
      stage: 2, // In Transit
      eta: "Arriving by Friday, Nov 3",
      patientName: "Aarav Mehta",
      date: "Today",
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_QUEUE);
  const [reports, setReports] = useState<PatientReport[]>(INITIAL_REPORTS);
  const [prescription, setPrescription] = useState<Prescription>(INITIAL_PRESCRIPTION);
  const [fees, setFees] = useState({ comprehensive: 1500, followUp: 800 });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role) setRoleState(parsed.role);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.appointments) setAppointments(parsed.appointments);
        if (parsed.reports) setReports(parsed.reports);
        if (parsed.prescription) setPrescription(parsed.prescription);
        if (parsed.fees) setFees(parsed.fees);
      }
    } catch (e) {
      console.warn("Storage load error", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ role, orders, appointments, reports, prescription, fees })
      );
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }, [role, orders, appointments, reports, prescription, fees]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    showToast(newRole === "doctor" ? "Switched to Doctor Practice Console" : "Switched to Patient View");
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        doctorTab,
        setDoctorTab,
        orders,
        addOrder: (order) => setOrders((prev) => [order, ...prev]),
        appointments,
        addAppointment: (app) => setAppointments((prev) => [app, ...prev]),
        reports,
        addReport: (rep) => setReports((prev) => [rep, ...prev]),
        prescription,
        updatePrescription: setPrescription,
        fees,
        updateFees: setFees,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

