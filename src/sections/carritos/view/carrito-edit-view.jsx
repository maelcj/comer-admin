'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { getCarrito } from 'src/actions/carritos';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CarritoProductos from '../carrito-productos';
import CarritoDatosEnvio from '../carrito-datos-envio';
import CarritoRefacciones from '../carrito-refacciones';
import CarritoDatosFacturacion from '../carrito-datos-facturacion';

// ----------------------------------------------------------------------

export function CarritoEditView({ carritoPrev }) {
  const [carrito, setCarrito] = useState(carritoPrev.carrito);

  const handleGetCarrito = async () => {
    const res = await getCarrito(carrito.id);
    setCarrito(res.carrito);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`Carrito #${carrito?.id}`}
        slotProps={{ heading: { color: `primary.main` } }}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Carritos', href: paths.dashboard.carritos.root },
          { name: `carrito #${carrito?.id}` },
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
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2">{carrito.cliente || 'Sin cliente'}</Typography>
                  <Typography variant="body2">{carrito?.datos_envio?.correo || ''}</Typography>
                  <Typography variant="body2">{carrito?.datos_envio?.telefono || ''}</Typography>
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
                  <Typography variant="h5">{carrito.totalFormateado}</Typography>
                  <Typography
                    variant="h7"
                    sx={{ color: 'text.disabled', flexGrow: 1, lineHeight: 1 }}
                  >
                    Creado: {carrito.creado}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ color: 'text.disabled', flexGrow: 1, lineHeight: 1 }}
                  >
                    Actualizado: {carrito.actualizado}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={12} order={{ xs: 3, md: 3 }}>
          <CarritoProductos carrito={carrito} handleGetCarrito={handleGetCarrito} />
        </Grid>

        <Grid xs={12} md={12} order={{ xs: 4, md: 4 }}>
          <CarritoRefacciones carrito={carrito} handleGetCarrito={handleGetCarrito} />
        </Grid>

        <Grid xs={12} md={6} order={{ xs: 5, md: 5 }}>
          <CarritoDatosEnvio carrito={carrito} handleGetCarrito={handleGetCarrito} />
        </Grid>

        <Grid xs={12} md={6} order={{ xs: 6, md: 6 }}>
          <CarritoDatosFacturacion carrito={carrito} handleGetCarrito={handleGetCarrito} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
