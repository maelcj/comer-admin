'use client';

import Grid from '@mui/material/Unstable_Grid2';

import Guias from './pedido-guias';
import ProductosTransito from './pedido-productos-transito';
import RefaccionesTransito from './pedido-refacciones-transito';

export function TabTransito({ pedido, handleGetPedido }) {
  return (
    <>
      <Grid xs={12} md={6}>
        <ProductosTransito pedido={pedido} handleGetPedido={handleGetPedido} />
        <RefaccionesTransito pedido={pedido} handleGetPedido={handleGetPedido} />
      </Grid>
      <Grid xs={12} md={6}>
        <Guias pedido={pedido} handleGetPedido={handleGetPedido} />
      </Grid>
    </>
  );
}
