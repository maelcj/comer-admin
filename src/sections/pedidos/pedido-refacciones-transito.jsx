'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import PedidoRefaccionesTransitoRow from './pedido-refacciones-transito-row';

const RefaccionesTransito = ({ pedido, handleGetPedido }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card sx={{ mt: 2 }}>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
          Refacciones en tránsito:
        </Typography>

        {pedido?.refacciones_pedidas?.length > 0 && (
          <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
            {pedido?.refacciones_pedidas.map((refaccion_pedido, index) => (
              <PedidoRefaccionesTransitoRow
                key={refaccion_pedido.id}
                refaccion_pedido={refaccion_pedido}
                handleGetPedido={handleGetPedido}
                setIsLoading={setIsLoading}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default RefaccionesTransito;
