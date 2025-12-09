export interface Tenant {
  id: string;
  storeName: string;
  category: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

export interface SalesSubmission {
  id: string;
  tenantId: string;
  month: string; // Format: "YYYY-MM"
  salesAmount: number;
  submittedAt: string;
}

export interface Manager {
  id: string;
  email: string;
  name: string;
}

export type SubmissionStatus = 'submitted' | 'missing';
