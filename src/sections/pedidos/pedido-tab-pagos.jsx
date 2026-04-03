'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Pagos from './pedido-pagos';
import { FormPago } from './pedido-form-pago';

export function TabPagos({ pedido, handleGetPedido }) {
  return (
    <>
      <Grid xs={12} md={6}>
        <Card>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Registrar pago:
            </Typography>
            <FormPago pedido={pedido} handleGetPedido={handleGetPedido} />
          </Box>
        </Card>
      </Grid>
      <Grid xs={12} md={6}>
        <Pagos pedido={pedido} handleGetPedido={handleGetPedido} />
      </Grid>
    </>
  );
}
