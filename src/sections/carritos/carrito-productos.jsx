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

import CarritoProductosRow from './carrito-productos-row';
import CarritoProductosAgregarDialog from './carrito-productos-agregar-dialog';

const CarritoProductos = ({ carrito, handleGetCarrito }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogAgregarProductos, setOpenDialogAgregarProductos] = useState(false);

  return (
    <>
      <CarritoProductosAgregarDialog
        carrito={carrito}
        open={openDialogAgregarProductos}
        setOpen={setOpenDialogAgregarProductos}
        handleGetCarrito={handleGetCarrito}
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
          {carrito?.productos_carrito?.length > 0 && (
            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {carrito?.productos_carrito.map((producto_carrito, index) => (
                <CarritoProductosRow
                  key={producto_carrito.id}
                  producto_carrito={producto_carrito}
                  handleGetCarrito={handleGetCarrito}
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

export default CarritoProductos;
