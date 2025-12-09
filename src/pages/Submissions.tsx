import { useState } from 'react';
import { format } from 'date-fns';
import { Download, Search, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Submissions() {
  const { tenants, submissions } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const currentMonth = format(new Date(), 'yyyy-MM');

  const tenantsWithStatus = tenants.map(tenant => {
    const submission = submissions.find(
      s => s.tenantId === tenant.id && s.month === currentMonth
    );
    return {
      ...tenant,
      status: submission ? 'submitted' : 'missing',
      salesAmount: submission?.salesAmount,
      submittedAt: submission?.submittedAt,
    };
  });

  const filtered = tenantsWithStatus.filter(tenant => {
    const matchesSearch = tenant.storeName.toLowerCase().includes(search.toLowerCase()) ||
      tenant.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Store Name', 'Category', 'Status', 'Sales Amount', 'Submitted Date'];
    const rows = filtered.map(t => [
      t.storeName,
      t.category,
      t.status,
      t.salesAmount?.toString() || '',
      t.submittedAt ? format(new Date(t.submittedAt), 'yyyy-MM-dd HH:mm') : '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${currentMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Submissions</h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(), 'MMMM yyyy')} sales submissions
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by store or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sales Amount</TableHead>
                  <TableHead>Submitted Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No tenants found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.storeName}</TableCell>
                      <TableCell>{tenant.category}</TableCell>
                      <TableCell>
                        <Badge variant={tenant.status === 'submitted' ? 'default' : 'secondary'}>
                          {tenant.status === 'submitted' ? 'Submitted' : 'Missing'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {tenant.salesAmount !== undefined
                          ? `$${tenant.salesAmount.toLocaleString()}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        {tenant.submittedAt
                          ? format(new Date(tenant.submittedAt), 'MMM d, yyyy h:mm a')
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
