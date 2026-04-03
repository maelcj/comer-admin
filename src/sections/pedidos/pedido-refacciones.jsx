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

import PedidoRefaccionesRow from './pedido-refacciones-row';
import PedidoRefaccionesAgregarDialog from './pedido-refacciones-agregar-dialog';

const PedidoRefacciones = ({ pedido, handleGetPedido }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogAgregarRefacciones, setOpenDialogAgregarRefacciones] = useState(false);

  return (
    <>
      <PedidoRefaccionesAgregarDialog
        pedido={pedido}
        open={openDialogAgregarRefacciones}
        setOpen={setOpenDialogAgregarRefacciones}
        handleGetPedido={handleGetPedido}
      />
      <Card>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            Refacciones:
          </Typography>

          <Backdrop
            open={isLoading}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {pedido?.refacciones_pedidas?.length > 0 && (
            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {pedido?.refacciones_pedidas.map((refaccion_pedido, index) => (
                <PedidoRefaccionesRow
                  key={refaccion_pedido.id}
                  refaccion_pedido={refaccion_pedido}
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
                setOpenDialogAgregarRefacciones(true);
              }}
              sx={{ flexShrink: 0 }}
            >
              Agregar refacciones
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default PedidoRefacciones;
