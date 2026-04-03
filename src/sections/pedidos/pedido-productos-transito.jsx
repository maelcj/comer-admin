'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import PedidoProductosTransitoRow from './pedido-productos-transito-row';

const ProductosTransito = ({ pedido, handleGetPedido }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
          Productos en tránsito:
        </Typography>

        {pedido?.productos_pedidos?.length > 0 && (
          <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
            {pedido?.productos_pedidos.map((producto_pedido, index) => (
              <PedidoProductosTransitoRow
                key={producto_pedido.id}
                producto_pedido={producto_pedido}
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

export default ProductosTransito;
