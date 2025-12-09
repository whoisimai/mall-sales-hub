import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Building2, CheckCircle2 } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TenantSubmit() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { tenants, addSubmission, getSubmissionForMonth } = useData();
  const [salesAmount, setSalesAmount] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tenant = tenants.find(t => t.id === tenantId);
  const currentMonth = format(new Date(), 'yyyy-MM');
  const existingSubmission = tenant ? getSubmissionForMonth(tenant.id, currentMonth) : undefined;

  if (tenants.length === 0) {
  return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
}

  if (!tenant) {
    return <Navigate to="/404" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(salesAmount.replace(/,/g, ''));
    
    if (isNaN(amount) || amount < 0) {
      return;
    }

    addSubmission({
      tenantId: tenant.id,
      month: currentMonth,
      salesAmount: amount,
    });
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Submission Received!</h2>
            <p className="text-muted-foreground">
              Thank you for submitting your sales for {format(new Date(), 'MMMM yyyy')}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">{tenant.storeName}</CardTitle>
          <CardDescription>
            Submit your monthly sales for {format(new Date(), 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {existingSubmission && (
            <div className="mb-4 p-3 rounded-lg bg-muted text-sm">
              <p className="font-medium">Previous submission found</p>
              <p className="text-muted-foreground">
                ${existingSubmission.salesAmount.toLocaleString()} on{' '}
                {format(new Date(existingSubmission.submittedAt), 'MMM d, yyyy')}
              </p>
              <p className="text-muted-foreground mt-1">
                Submitting again will update your previous entry.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salesAmount">Total Sales Amount ($)</Label>
              <Input
                id="salesAmount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={salesAmount}
                onChange={(e) => setSalesAmount(e.target.value)}
                className="text-lg"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Submit Sales
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
