'use client';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import PedidoProductos from './pedido-productos';
import PedidoRefacciones from './pedido-refacciones';
import PedidoProductosAcciones from './pedido-productos-acciones';

export function TabProductos({ pedido, handleGetPedido }) {
  return (
    <>
      <Grid xs={12} md={8} order={{ xs: 2, md: 1 }}>
        <Stack spacing={2}>
          <PedidoProductos pedido={pedido} handleGetPedido={handleGetPedido} />
          <PedidoRefacciones pedido={pedido} handleGetPedido={handleGetPedido} />
        </Stack>
      </Grid>
      <Grid xs={12} md={4} order={{ xs: 1, md: 2 }}>
        <Stack spacing={2}>
          <PedidoProductosAcciones pedido={pedido} handleGetPedido={handleGetPedido} />
        </Stack>
      </Grid>
    </>
  );
}
