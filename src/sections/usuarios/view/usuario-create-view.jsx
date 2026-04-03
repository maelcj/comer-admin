'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UsuarioCreateForm } from '../usuario-create-form';

// ----------------------------------------------------------------------

export function UsuarioCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Registrar usuario"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Usuarios', href: paths.dashboard.usuarios.root },
          { name: 'Nuevo usuario' },
        ]}
        sx={{ mb: 3 }}
      />

      <UsuarioCreateForm />
    </DashboardContent>
  );
}
