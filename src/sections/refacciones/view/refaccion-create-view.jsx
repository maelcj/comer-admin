'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RefaccionCreateForm } from '../refaccion-create-form';

// ----------------------------------------------------------------------

export function RefaccionCreateView({ marcas }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Registrar refaccion"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Refacciones', href: paths.dashboard.refacciones.root },
          { name: 'Registrar refaccion' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RefaccionCreateForm marcas={marcas} />
    </DashboardContent>
  );
}
