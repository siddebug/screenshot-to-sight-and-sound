export type Role = "patient" | "doctor";

export type CourierProvider = 
  | "bluedart" 
  | "delhivery" 
  | "dtdc" 
  | "indiapost" 
  | "dhl" 
  | "fedex";

export interface CourierConfig {
  name: string;
  short: string;
  getUrl: (awb: string) => string;
}

export interface MedicineOrder {
  id: string;
  remedies: string[];
  courier: CourierProvider;
  awb: string;
  stage: 0 | 1 | 2 | 3; // 0: Dispensed, 1: Dispatched, 2: In Transit, 3: Delivered
  eta: string;
  patientName: string;
  date: string;
}

export interface Appointment {
  id: string;
  mode: "online" | "clinic";
  kind: "Comprehensive" | "Follow-up";
  date: string;
  time: string;
  patientName: string;
  complaint?: string;
  country?: string;
  status: "Upcoming" | "In Progress" | "Completed";
}

export interface PatientReport {
  id: string;
  name: string;
  date: string;
  size: string;
}

export interface PrescriptionRemedy {
  name: string;
  dose: string;
  duration: string;
}

export interface Prescription {
  id: string;
  date: string;
  patient: string;
  diagnosis: string;
  remedies: PrescriptionRemedy[];
  precautions: string[];
}

export interface ClinicalSpecialty {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  helps: string[];
  refer: string[];
}

export interface WellnessTip {
  title: string;
  tag: string;
  body: string;
}

