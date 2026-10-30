import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type CourierId, PRESCRIPTION, REPORTS, QUEUE_SEED, type PrescriptionData } from "./data";

export type Order = {
  id: string;
  remedies: string[];
  courier: CourierId;
  awb: string;
  stage: number; // index in ORDER_STAGES
  eta: string;
  patientName?: string;
  date?: string;
};

export type Appointment = {
  id: string;
  mode: "online" | "clinic";
  kind: "Comprehensive" | "Follow-up";
  date: string; // ISO
  time: string;
  patientName?: string;
  complaint?: string;
  country?: string;
};

export type PatientReport = {
  id: string;
  name: string;
  date: string;
  size: string;
};

export type DoctorTab = "queue" | "patients" | "dispatch" | "settings";

type Store = {
  role: "patient" | "doctor";
  setRole: (r: "patient" | "doctor") => void;
  doctorTab: DoctorTab;
  setDoctorTab: (tab: DoctorTab) => void;
  orders: Order[];
  addOrder: (o: Order) => void;
  appointments: Appointment[];
  addAppointment: (a: Appointment) => void;
  reports: PatientReport[];
  addReport: (r: PatientReport) => void;
  activePrescription: typeof PRESCRIPTION;
  updatePrescription: (rx: typeof PRESCRIPTION) => void;
  consultationFees: { comprehensive: number; followUp: number };
  updateFees: (fees: { comprehensive: number; followUp: number }) => void;
};

const Ctx = createContext<Store | null>(null);

const STORAGE_KEY = "medicate_app_state_v1";

const nextDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<"patient" | "doctor">("patient");
  const [doctorTab, setDoctorTab] = useState<DoctorTab>("queue");
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: "ORD-7731", 
      remedies: ["Pulsatilla 200", "Arnica Montana 30C", "Natrum Mur 6X"], 
      courier: "bluedart", 
      awb: "BD849201928IN", 
      stage: 2, 
      eta: "Arriving by Friday, Nov 3",
      patientName: "Aarav Mehta"
    },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "A-1", mode: "online", kind: "Follow-up", date: nextDays(0), time: "18:30", patientName: "Aarav Mehta", complaint: "Sneezing and allergic rhinitis" },
  ]);
  const [reports, setReports] = useState<PatientReport[]>(REPORTS);
  const [activePrescription, setActivePrescription] = useState(PRESCRIPTION);
  const [consultationFees, setConsultationFees] = useState({ comprehensive: 1500, followUp: 800 });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.role) setRoleState(data.role);
        if (data.orders) setOrders(data.orders);
        if (data.appointments) setAppointments(data.appointments);
        if (data.reports) setReports(data.reports);
        if (data.activePrescription) setActivePrescription(data.activePrescription);
        if (data.consultationFees) setConsultationFees(data.consultationFees);
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          role,
          orders,
          appointments,
          reports,
          activePrescription,
          consultationFees,
        })
      );
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [role, orders, appointments, reports, activePrescription, consultationFees]);

  const setRole = (r: "patient" | "doctor") => {
    setRoleState(r);
  };

  return (
    <Ctx.Provider
      value={{
        role,
        setRole,
        doctorTab,
        setDoctorTab,
        orders,
        addOrder: (o) => setOrders((p) => [o, ...p]),
        appointments,
        addAppointment: (a) => setAppointments((p) => [a, ...p]),
        reports,
        addReport: (r) => setReports((p) => [r, ...p]),
        activePrescription,
        updatePrescription: (rx) => setActivePrescription(rx),
        consultationFees,
        updateFees: (fees) => setConsultationFees(fees),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
