/**
 * Medicate Database & Local Storage Client Layer
 * Compatible with PocketBase REST API and LocalStorage / IndexedDB fallback.
 */

import { Appointment, MedicineOrder, PatientReport, Prescription } from "../types";
import { INITIAL_PRESCRIPTION, INITIAL_QUEUE, INITIAL_REPORTS } from "../data/mockData";

const STORAGE_KEYS = {
  APPOINTMENTS: "medicate_appointments_v2",
  PRESCRIPTIONS: "medicate_prescriptions_v2",
  REPORTS: "medicate_reports_v2",
  ORDERS: "medicate_orders_v2",
  FEES: "medicate_fees_v2",
};

// PocketBase URL configuration (can be local or deployed on free tier like Fly.io / Render)
const POCKETBASE_URL = (import.meta as any).env?.VITE_POCKETBASE_URL || "http://127.0.0.1:8090";

class MedicateDatabaseService {
  private pbUrl: string;

  constructor() {
    this.pbUrl = POCKETBASE_URL;
  }

  // --- Appointments ---
  async getAppointments(): Promise<Appointment[]> {
    try {
      // Try PocketBase first if server is running
      const res = await fetch(`${this.pbUrl}/api/collections/appointments/records?sort=-created`, {
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return data.items.map((item: any) => ({
            id: item.id,
            mode: item.mode,
            kind: item.kind,
            date: item.date,
            time: item.time,
            patientName: item.patientName,
            patientPhone: item.patientPhone,
            patientWhatsApp: item.patientWhatsApp,
            complaint: item.complaint,
            country: item.country,
            status: item.status,
          }));
        }
      }
    } catch {
      // Server not reachable; gracefully fall back to local storage
    }

    const local = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return local ? JSON.parse(local) : INITIAL_QUEUE;
  }

  saveAppointmentsLocally(appointments: Appointment[]): void {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }

  // --- Prescriptions ---
  async getPrescription(): Promise<Prescription> {
    try {
      const res = await fetch(`${this.pbUrl}/api/collections/prescriptions/records?sort=-created&limit=1`, {
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          return {
            id: item.rxCode || item.id,
            date: item.date || "Today",
            patient: item.patientName,
            diagnosis: item.diagnosis,
            remedies: item.remedies || [],
            precautions: item.precautions || [],
          };
        }
      }
    } catch {
      // Fallback
    }

    const local = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return local ? JSON.parse(local) : INITIAL_PRESCRIPTION;
  }

  savePrescriptionLocally(prescription: Prescription): void {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescription));
  }

  // --- Lab Reports Vault ---
  async getReports(): Promise<PatientReport[]> {
    try {
      const res = await fetch(`${this.pbUrl}/api/collections/lab_reports/records?sort=-created`, {
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return data.items.map((item: any) => ({
            id: item.id,
            name: item.title,
            date: item.created ? new Date(item.created).toLocaleDateString() : "Recent",
            size: item.size || "1.2 MB",
          }));
        }
      }
    } catch {
      // Fallback
    }

    const local = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return local ? JSON.parse(local) : INITIAL_REPORTS;
  }

  saveReportsLocally(reports: PatientReport[]): void {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }

  // --- Medicine Orders (Courier Logistics) ---
  async getOrders(): Promise<MedicineOrder[]> {
    try {
      const res = await fetch(`${this.pbUrl}/api/collections/medicine_orders/records?sort=-created`, {
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return data.items;
        }
      }
    } catch {
      // Fallback
    }

    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return local
      ? JSON.parse(local)
      : [
          {
            id: "ORD-7731",
            remedies: ["Pulsatilla 200", "Arnica Montana 30C", "Natrum Mur 6X"],
            courier: "bluedart",
            awb: "BD849201928IN",
            stage: 2,
            eta: "Arriving by Friday, Nov 3",
            patientName: "Aarav Mehta",
            date: "Today",
          },
        ];
  }

  saveOrdersLocally(orders: MedicineOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
}

export const dbService = new MedicateDatabaseService();

