import { createContext, useContext, useState, type ReactNode } from "react";
import type { CourierId } from "./data";

export type Order = {
  id: string;
  remedies: string[];
  courier: CourierId;
  awb: string;
  stage: number; // index in ORDER_STAGES
  eta: string;
};

export type Appointment = {
  id: string;
  mode: "online" | "clinic";
  kind: "Comprehensive" | "Follow-up";
  date: string; // ISO
  time: string;
};

type Store = {
  role: "patient" | "doctor";
  setRole: (r: "patient" | "doctor") => void;
  orders: Order[];
  addOrder: (o: Order) => void;
  appointments: Appointment[];
  addAppointment: (a: Appointment) => void;
};

const Ctx = createContext<Store | null>(null);

const nextDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD-7731", remedies: ["Pulsatilla 200", "Arnica Montana 30C", "Natrum Mur 6X"], courier: "bluedart", awb: "BD849201928IN", stage: 2, eta: "Arriving by Friday, Nov 3" },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "A-1", mode: "online", kind: "Follow-up", date: nextDays(0), time: "18:30" },
  ]);
  return (
    <Ctx.Provider
      value={{
        role,
        setRole,
        orders,
        addOrder: (o) => setOrders((p) => [o, ...p]),
        appointments,
        addAppointment: (a) => setAppointments((p) => [...p, a]),
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
