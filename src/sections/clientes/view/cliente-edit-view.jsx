'use client';

import { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { getCliente } from 'src/actions/clientes';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClientePedidos } from '../cliente-pedidos';
import { ClienteEditForm } from '../cliente-edit-form';
import { ClienteCotizaciones } from '../cliente-cotizaciones';

// ----------------------------------------------------------------------

export function ClienteEditView({ clientePrev }) {
  const [cliente, setCliente] = useState(clientePrev);

  const handleGetCliente = async () => {
    const res = await getCliente(cliente.id);
    setCliente(res.cliente);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar cliente"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Punto de venta', href: paths.dashboard.pos.root },
          { name: cliente?.nombre },
        ]}
        sx={{ mb: 3 }}
      />

      <ClienteEditForm cliente={cliente} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid xs={12} md={6}>
          <ClienteCotizaciones cliente={cliente} />
        </Grid>
        <Grid xs={12} md={6}>
          <ClientePedidos cliente={cliente} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
