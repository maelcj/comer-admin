'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClienteCreateForm } from '../cliente-create-form';

// ----------------------------------------------------------------------

export function ClienteCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Registrar cliente"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Registrar cliente' }]}
        sx={{ mb: 3 }}
      />

      <ClienteCreateForm />
    </DashboardContent>
  );
}
