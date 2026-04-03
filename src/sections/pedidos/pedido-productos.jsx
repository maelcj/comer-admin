'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

import PedidoProductosRow from './pedido-productos-row';
import PedidoProductosAgregarDialog from './pedido-productos-agregar-dialog';

const PedidoProductos = ({ pedido, handleGetPedido }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogAgregarProductos, setOpenDialogAgregarProductos] = useState(false);

  return (
    <>
      <PedidoProductosAgregarDialog
        pedido={pedido}
        open={openDialogAgregarProductos}
        setOpen={setOpenDialogAgregarProductos}
        handleGetPedido={handleGetPedido}
      />
      <Card>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            Productos:
          </Typography>

          <Backdrop
            open={isLoading}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {pedido?.productos_pedidos?.length > 0 && (
            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {pedido?.productos_pedidos.map((producto_pedido, index) => (
                <PedidoProductosRow
                  key={producto_pedido.id}
                  producto_pedido={producto_pedido}
                  handleGetPedido={handleGetPedido}
                  setIsLoading={setIsLoading}
                />
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          <Stack
            spacing={3}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-end', md: 'center' }}
          >
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setOpenDialogAgregarProductos(true);
              }}
              sx={{ flexShrink: 0 }}
            >
              Agregar productos
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default PedidoProductos;
