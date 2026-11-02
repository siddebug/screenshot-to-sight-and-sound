/**
 * Helper utility to build third-party courier tracking URLs
 * for Dr. Chetali's Health & Homeopathy mobile application.
 */

export type CourierProvider = 
  | 'BLUEDART' 
  | 'DELHIVERY' 
  | 'DTDC' 
  | 'INDIAPOST' 
  | 'DHL' 
  | 'FEDEX' 
  | 'OTHER';

export interface MedicineShipment {
  id: string;
  prescriptionId: string;
  patientName: string;
  remedySummary: string;
  provider: CourierProvider;
  providerName: string;
  trackingNumber: string;
  status: 'DISPENSED' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED';
  dispatchedDate: string;
  estimatedDeliveryDate?: string;
  customTrackingUrl?: string;
}

/**
 * Returns the exact direct-tracking URL for a given courier provider and AWB.
 */
export function getTrackingUrl(provider: CourierProvider, trackingNumber: string, customUrl?: string): string {
  const awb = encodeURIComponent(trackingNumber.trim());

  switch (provider) {
    case 'BLUEDART':
      return `https://www.bluedart.com/tracking?trackNumber=${awb}`;
    case 'DELHIVERY':
      return `https://www.delhivery.com/track/package/${awb}`;
    case 'DTDC':
      return `https://www.dtdc.in/tracking.asp?trknbr=${awb}`;
    case 'INDIAPOST':
      return `https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx`;
    case 'DHL':
      return `https://www.dhl.com/en/express/tracking.html?AWB=${awb}`;
    case 'FEDEX':
      return `https://www.fedex.com/fedextrack/?trknbr=${awb}`;
    case 'OTHER':
    default:
      return customUrl || `https://www.google.com/search?q=${encodeURIComponent(`${provider} tracking ${trackingNumber}`)}`;
  }
}

