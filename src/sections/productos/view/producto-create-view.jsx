'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductoCreateForm } from '../producto-create-form';

// ----------------------------------------------------------------------

export function ProductoCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Registrar producto"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Productos', href: paths.dashboard.productos.root },
          { name: 'Registrar producto' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductoCreateForm />
    </DashboardContent>
  );
}
