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

import CarritoRefaccionesRow from './carrito-refacciones-row';
import CarritoRefaccionesAgregarDialog from './carrito-refacciones-agregar-dialog';

const CarritoRefacciones = ({ carrito, handleGetCarrito }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogAgregarRefacciones, setOpenDialogAgregarRefacciones] = useState(false);

  return (
    <>
      <CarritoRefaccionesAgregarDialog
        carrito={carrito}
        open={openDialogAgregarRefacciones}
        setOpen={setOpenDialogAgregarRefacciones}
        handleGetCarrito={handleGetCarrito}
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
          {carrito?.refacciones_carrito?.length > 0 && (
            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {carrito?.refacciones_carrito.map((refaccion_carrito, index) => (
                <CarritoRefaccionesRow
                  key={refaccion_carrito.id}
                  refaccion_carrito={refaccion_carrito}
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

export default CarritoRefacciones;
