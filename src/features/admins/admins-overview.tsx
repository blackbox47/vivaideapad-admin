import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AddAdminDialog from '@/features/admins/add-admin-dialog';
import AdminsTable from '@/features/admins/admins-table';
import RemoveAdminDialog from '@/features/admins/remove-admin-dialog';
import useAdmins from '@/hooks/admins/use-admins';
import type {
  CreateAdminBody,
  WorkspaceAdmin,
} from '@/models/admins/admins-model';

export default function AdminsOverview() {
  const {
    admins,
    canManage,
    isLoading,
    isError,
    error,
    refetch,
    createAdmin,
    removeAdmin,
    isCreating,
    isRemoving,
    createError,
    removeError,
    resetCreate,
    resetRemove,
  } = useAdmins();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [removing, setRemoving] = useState<WorkspaceAdmin | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const closeAdd = () => {
    resetCreate();
    setIsAddOpen(false);
  };

  const closeRemove = () => {
    resetRemove();
    setRemoving(null);
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const handleCreate = async (body: CreateAdminBody) => {
    try {
      await createAdmin(body).unwrap();
      closeAdd();
      showToast('Admin added');
    } catch {
      // Error is surfaced via createError.
    }
  };

  const handleRemove = async () => {
    if (!removing) {
      return;
    }

    try {
      await removeAdmin(removing.id).unwrap();
      closeRemove();
      showToast('Admin removed');
    } catch {
      // Error is surfaced via removeError.
    }
  };

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load admins
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Manage admins"
        description="Grant workspace access or remove operators who no longer need it."
        action={
          canManage ? (
            <Button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest"
            >
              + Add admin
            </Button>
          ) : null
        }
      />

      {isLoading || canManage ? null : (
        <p className="mb-4 text-[13px] text-muted-foreground">
          Only the platform owner can add or remove admins.
        </p>
      )}

      {isLoading ? (
        <div className="overflow-hidden rounded-[18px] border border-border bg-card p-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-12 w-full" />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <div className="rounded-[22px] border border-border bg-card px-6 py-[60px] text-center text-muted-foreground">
          <span className="mb-2.5 block text-[28px]">◇</span>
          <strong className="mb-1 block text-foreground">No admins yet</strong>
          <span className="text-[13px]">
            Add an operator so they can sign in to the admin workspace.
          </span>
        </div>
      ) : (
        <AdminsTable
          admins={admins}
          canManage={canManage}
          onRemove={setRemoving}
        />
      )}

      {isAddOpen ? (
        <AddAdminDialog
          isSubmitting={isCreating}
          error={createError}
          onClose={closeAdd}
          onSubmit={handleCreate}
        />
      ) : null}

      {removing ? (
        <RemoveAdminDialog
          admin={removing}
          isSubmitting={isRemoving}
          error={removeError}
          onClose={closeRemove}
          onConfirm={handleRemove}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-[26px] left-1/2 z-[60] -translate-x-1/2 rounded-full bg-primary px-[22px] py-3.5 text-[13px] font-semibold text-primary-foreground shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
