import { Store, FileCheck, AlertCircle, DollarSign } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useData } from '@/hooks/useData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function Dashboard() {
  const { tenants, submissions } = useData();
  
  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthSubmissions = submissions.filter(s => s.month === currentMonth);
  
  const totalTenants = tenants.length;
  const submittedCount = currentMonthSubmissions.length;
  const missingCount = totalTenants - submittedCount;
  const totalSales = currentMonthSubmissions.reduce((sum, s) => sum + s.salesAmount, 0);

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of {format(new Date(), 'MMMM yyyy')} sales submissions
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Tenants"
            value={totalTenants}
            icon={Store}
            variant="default"
          />
          <StatCard
            title="Submitted"
            value={submittedCount}
            icon={FileCheck}
            variant="success"
          />
          <StatCard
            title="Missing"
            value={missingCount}
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Total Sales"
            value={`$${totalSales.toLocaleString()}`}
            icon={DollarSign}
            variant="primary"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No submissions yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentSubmissions.map(submission => {
                  const tenant = tenants.find(t => t.id === submission.tenantId);
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{tenant?.storeName || 'Unknown Store'}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(submission.submittedAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        ${submission.salesAmount.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
