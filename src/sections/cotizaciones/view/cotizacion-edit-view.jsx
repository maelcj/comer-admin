'use client';

import { useState } from 'react';
import * as NProgress from 'nprogress';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { getCotizacion } from 'src/actions/cotizaciones';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CotizacionAcciones from '../cotizacion-acciones';
import CotizacionProductos from '../cotizacion-productos';
import CotizacionRefacciones from '../cotizacion-refacciones';

// ----------------------------------------------------------------------

export function CotizacionEditView({ cotizacionPrev }) {
  const router = useRouter();
  const [cotizacion, setCotizacion] = useState(cotizacionPrev);

  const mdUp = useResponsive('up', 'md');

  const handleGetCotizacion = async () => {
    const res = await getCotizacion(cotizacion.id);
    setCotizacion(res.cotizacion);
  };

  const handleEditCliente = (id) => {
    NProgress.start();
    router.push(paths.dashboard.clientes.edit(id));
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`Cotizacion #${cotizacion?.id}`}
        slotProps={{ heading: { color: `primary.main` } }}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Punto de venta', href: paths.dashboard.pos.root },
          {
            name: `${cotizacion?.cliente ? cotizacion.cliente.nombre : 'Clientes'}`,
            href: cotizacion?.cliente
              ? paths.dashboard.clientes.edit(cotizacion?.cliente.id)
              : undefined,
          },
          { name: `cotización #${cotizacion?.id}` },
        ]}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2}>
        <Grid xs={12} md={8} order={{ xs: 1 }}>
          <Card>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ p: 1 }}>
              <Stack sx={{ width: 1 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                    Cliente:
                  </Typography>

                  {cotizacion?.cliente && (
                    <Tooltip title="Editar" placement="top" arrow>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          handleEditCliente(cotizacion.cliente.id);
                        }}
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2">
                    {cotizacion?.cliente
                      ? cotizacion.cliente.nombre
                      : cotizacion.carrito.datos_envio.recibe}
                  </Typography>
                  <Typography variant="body2">
                    {cotizacion?.cliente
                      ? cotizacion.cliente.correo
                      : cotizacion.carrito.datos_envio.correo}
                  </Typography>
                  <Typography variant="body2">
                    {cotizacion?.cliente
                      ? cotizacion.cliente.celular
                      : cotizacion.carrito.datos_envio.telefono}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={4} order={{ xs: 2, md: 2 }}>
          <Card>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ p: 2 }}>
              <Stack sx={{ width: 1 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                    Total:
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h5">{cotizacion.total_formateado}</Typography>
                  <Typography
                    variant="h7"
                    sx={{ color: 'text.disabled', flexGrow: 1, lineHeight: 1 }}
                  >
                    Creada: {new Date(cotizacion?.created_at).toLocaleDateString()} -{' '}
                    {new Date(cotizacion?.created_at).toLocaleTimeString()}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ color: 'text.disabled', flexGrow: 1, lineHeight: 1 }}
                  >
                    Actualizada: {new Date(cotizacion?.updated_at).toLocaleDateString()} -{' '}
                    {new Date(cotizacion?.updated_at).toLocaleTimeString()}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={8} order={{ xs: 4, md: 3 }}>
          <Stack spacing={2}>
            <CotizacionProductos
              cotizacion={cotizacion}
              handleGetCotizacion={handleGetCotizacion}
            />
            <CotizacionRefacciones
              cotizacion={cotizacion}
              handleGetCotizacion={handleGetCotizacion}
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={4} order={{ xs: 3, md: 4 }}>
          <Stack spacing={2}>
            <CotizacionAcciones cotizacion={cotizacion} handleGetCotizacion={handleGetCotizacion} />
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
