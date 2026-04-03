'use client';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RefaccionesCarga from '../refacciones-carga';
import { RefaccionesTable } from '../refacciones-table';

// ----------------------------------------------------------------------

export function RefaccionesListView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Refacciones"
        links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Refacciones' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button
            href={paths.dashboard.refacciones.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Nueva refacción
          </Button>
        }
      />
      <Card>
        <RefaccionesTable />
      </Card>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid xs={12} md={6}>
          <Card>
            <RefaccionesCarga />
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
