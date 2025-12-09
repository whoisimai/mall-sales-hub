import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, SalesSubmission } from '@/types';

interface DataContextType {
  tenants: Tenant[];
  submissions: SalesSubmission[];
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  addSubmission: (submission: Omit<SalesSubmission, 'id' | 'submittedAt'>) => void;
  getTenantSubmissions: (tenantId: string) => SalesSubmission[];
  getSubmissionForMonth: (tenantId: string, month: string) => SalesSubmission | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_TENANTS: Tenant[] = [
  { id: '1', storeName: 'Fashion Forward', category: 'Apparel', contactName: 'Jane Smith', contactEmail: 'jane@fashionforward.com', contactPhone: '555-0101', createdAt: '2024-01-01' },
  { id: '2', storeName: 'Tech Haven', category: 'Electronics', contactName: 'John Doe', contactEmail: 'john@techhaven.com', contactPhone: '555-0102', createdAt: '2024-01-01' },
  { id: '3', storeName: 'Foodie Paradise', category: 'Food & Beverage', contactName: 'Mike Chen', contactEmail: 'mike@foodieparadise.com', contactPhone: '555-0103', createdAt: '2024-01-01' },
  { id: '4', storeName: 'Beauty Bliss', category: 'Health & Beauty', contactName: 'Sarah Wilson', contactEmail: 'sarah@beautybliss.com', contactPhone: '555-0104', createdAt: '2024-01-01' },
  { id: '5', storeName: 'Sports Zone', category: 'Sports & Fitness', contactName: 'Tom Brown', contactEmail: 'tom@sportszone.com', contactPhone: '555-0105', createdAt: '2024-01-01' },
];

const INITIAL_SUBMISSIONS: SalesSubmission[] = [
  { id: '1', tenantId: '1', month: '2024-12', salesAmount: 45000, submittedAt: '2024-12-05T10:30:00Z' },
  { id: '2', tenantId: '2', month: '2024-12', salesAmount: 78000, submittedAt: '2024-12-03T14:15:00Z' },
  { id: '3', tenantId: '3', month: '2024-12', salesAmount: 23000, submittedAt: '2024-12-07T09:00:00Z' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [submissions, setSubmissions] = useState<SalesSubmission[]>([]);

  useEffect(() => {
    const storedTenants = localStorage.getItem('tenants');
    const storedSubmissions = localStorage.getItem('submissions');
    
    if (storedTenants) {
      setTenants(JSON.parse(storedTenants));
    } else {
      setTenants(INITIAL_TENANTS);
      localStorage.setItem('tenants', JSON.stringify(INITIAL_TENANTS));
    }
    
    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions));
    } else {
      setSubmissions(INITIAL_SUBMISSIONS);
      localStorage.setItem('submissions', JSON.stringify(INITIAL_SUBMISSIONS));
    }
  }, []);

  const saveTenants = (newTenants: Tenant[]) => {
    setTenants(newTenants);
    localStorage.setItem('tenants', JSON.stringify(newTenants));
  };

  const saveSubmissions = (newSubmissions: SalesSubmission[]) => {
    setSubmissions(newSubmissions);
    localStorage.setItem('submissions', JSON.stringify(newSubmissions));
  };

  const addTenant = (tenant: Omit<Tenant, 'id' | 'createdAt'>) => {
    const newTenant: Tenant = {
      ...tenant,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveTenants([...tenants, newTenant]);
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    const updated = tenants.map(t => t.id === id ? { ...t, ...updates } : t);
    saveTenants(updated);
  };

  const deleteTenant = (id: string) => {
    saveTenants(tenants.filter(t => t.id !== id));
  };

  const addSubmission = (submission: Omit<SalesSubmission, 'id' | 'submittedAt'>) => {
    const existing = submissions.find(
      s => s.tenantId === submission.tenantId && s.month === submission.month
    );
    
    if (existing) {
      const updated = submissions.map(s =>
        s.id === existing.id
          ? { ...s, salesAmount: submission.salesAmount, submittedAt: new Date().toISOString() }
          : s
      );
      saveSubmissions(updated);
    } else {
      const newSubmission: SalesSubmission = {
        ...submission,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
      };
      saveSubmissions([...submissions, newSubmission]);
    }
  };

  const getTenantSubmissions = (tenantId: string) => {
    return submissions.filter(s => s.tenantId === tenantId);
  };

  const getSubmissionForMonth = (tenantId: string, month: string) => {
    return submissions.find(s => s.tenantId === tenantId && s.month === month);
  };

  return (
    <DataContext.Provider value={{
      tenants,
      submissions,
      addTenant,
      updateTenant,
      deleteTenant,
      addSubmission,
      getTenantSubmissions,
      getSubmissionForMonth,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
