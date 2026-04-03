'use client';

import { Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OfertasTemporalesTable } from '../ofertas-temporales-table';

// ----------------------------------------------------------------------

export function OfertasListView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ofertas"
        links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Ofertas' }]}
        sx={{ mb: 3 }}
      />

      <Stack spacing={3}>
        <OfertasTemporalesTable />
      </Stack>
    </DashboardContent>
  );
}
