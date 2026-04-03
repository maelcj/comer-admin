'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { Facturas } from './pedido-facturas';
import { FormEnvio } from './pedido-form-envio';
import { Constancia } from './pedido-constancia';
import { FormFacturacion } from './pedido-form-facturacion';

export function TabEnvio({ pedido, handleGetPedido }) {
  return (
    <>
      <Grid xs={12} md={6}>
        <Card>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Datos de envío:
            </Typography>
            <FormEnvio pedido={pedido} />
          </Box>
        </Card>
      </Grid>
      <Grid xs={12} md={6}>
        <Card>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Datos de facturación:
            </Typography>
            <FormFacturacion pedido={pedido} />
          </Box>
        </Card>
      </Grid>
      <Grid xs={12} md={6}>
        <Card>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Facturas:
            </Typography>
            <Facturas pedido={pedido} handleGetPedido={handleGetPedido} />
          </Box>
        </Card>
      </Grid>
      <Grid xs={12} md={6}>
        <Card>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Constancia de situación fiscal:
            </Typography>
            <Constancia pedido={pedido} handleGetPedido={handleGetPedido} />
          </Box>
        </Card>
      </Grid>
    </>
  );
}
