'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { plusIcon, searchIcon } from 'src/components/icons';
import { payPalIcon } from 'src/components/icons/payPalIcon';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PedidosDialog from '../pedidos-dialog';
import { ClientesTable } from '../clientes-table';
import PagosPayPalDialog from '../pagos-paypal-dialog';
import CotizacionesDialog from '../cotizaciones-dialog';

// ----------------------------------------------------------------------

export function PosListView() {
  const router = useRouter();
  const [openDialogPagosPaPal, setOpenDialogPagosPaPal] = useState(false);
  const [openDialogPedidos, setOpenDialogPedidos] = useState(false);
  const [openDialogCotizaciones, setOpenDialogCotizaciones] = useState(false);

  return (
    <DashboardContent>
      <PagosPayPalDialog open={openDialogPagosPaPal} setOpen={setOpenDialogPagosPaPal} />
      <PedidosDialog open={openDialogPedidos} setOpen={setOpenDialogPedidos} />
      <CotizacionesDialog open={openDialogCotizaciones} setOpen={setOpenDialogCotizaciones} />
      <CustomBreadcrumbs
        heading="Punto de venta"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Punto de venta' }]}
        sx={{ mb: 3 }}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="soft"
          color="primary"
          startIcon={searchIcon}
          onClick={() => setOpenDialogPedidos(true)}
        >
          Pedidos
        </Button>
        <Button
          variant="soft"
          color="primary"
          startIcon={searchIcon}
          onClick={() => setOpenDialogCotizaciones(true)}
        >
          Cotizaciones
        </Button>
        <Button
          variant="soft"
          color="success"
          startIcon={payPalIcon}
          onClick={() => setOpenDialogPagosPaPal(true)}
        >
          Pagos PayPal
        </Button>
      </Stack>
      <Card sx={{ p: 0 }}>
        <CardHeader
          title="Clientes"
          action={
            <Button
              color="primary"
              startIcon={plusIcon}
              onClick={() => router.push(paths.dashboard.clientes.create)}
            >
              Registrar
            </Button>
          }
          sx={{ mb: 2, pt: 2 }}
        />

        <Divider />
        <ClientesTable />
      </Card>
    </DashboardContent>
  );
}
