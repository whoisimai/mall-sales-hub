import { useState } from 'react';
import { Plus, Pencil, Trash2, Link as LinkIcon, History } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tenant } from '@/types';
import { format } from 'date-fns';

export default function Tenants() {
  const { tenants, addTenant, updateTenant, deleteTenant, getTenantSubmissions } = useData();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  
  const [formData, setFormData] = useState({
    storeName: '',
    category: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const resetForm = () => {
    setFormData({
      storeName: '',
      category: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    });
    setEditingTenant(null);
  };

  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      storeName: tenant.storeName,
      category: tenant.category,
      contactName: tenant.contactName,
      contactEmail: tenant.contactEmail,
      contactPhone: tenant.contactPhone,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTenant) {
      updateTenant(editingTenant.id, formData);
      toast({ title: 'Tenant updated successfully' });
    } else {
      addTenant(formData);
      toast({ title: 'Tenant added successfully' });
    }
    
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteTenant(deleteId);
      toast({ title: 'Tenant deleted successfully' });
      setDeleteId(null);
    }
  };

  const copySubmissionLink = (tenantId: string) => {
    const link = `${window.location.origin}/submit/${tenantId}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Submission link copied to clipboard' });
  };

  const openHistory = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsHistoryOpen(true);
  };

  const tenantHistory = selectedTenant ? getTenantSubmissions(selectedTenant.id) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tenants</h1>
            <p className="text-muted-foreground mt-1">
              Manage mall tenants and their submission links
            </p>
          </div>
          <Button onClick={openAddForm}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No tenants yet. Add your first tenant to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.storeName}</TableCell>
                      <TableCell>{tenant.category}</TableCell>
                      <TableCell>{tenant.contactName}</TableCell>
                      <TableCell>{tenant.contactEmail}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copySubmissionLink(tenant.id)}
                            title="Copy submission link"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openHistory(tenant)}
                            title="View history"
                          >
                            <History className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditForm(tenant)}
                            title="Edit tenant"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(tenant.id)}
                            title="Delete tenant"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTenant ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
            <DialogDescription>
              {editingTenant ? 'Update tenant information' : 'Enter the details for the new tenant'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTenant ? 'Save Changes' : 'Add Tenant'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tenant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission History</DialogTitle>
            <DialogDescription>
              {selectedTenant?.storeName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {tenantHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No submissions yet
              </p>
            ) : (
              <div className="space-y-3">
                {tenantHistory
                  .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                  .map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">
                          {format(new Date(submission.month + '-01'), 'MMMM yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        ${submission.salesAmount.toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
