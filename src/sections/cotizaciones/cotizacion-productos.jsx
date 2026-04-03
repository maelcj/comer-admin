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

import CotizacionProductosRow from './cotizacion-productos-row';
import CotizacionProductosAgregarDialog from './cotizacion-productos-agregar-dialog';

const CotizacionProductos = ({ cotizacion, handleGetCotizacion }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogAgregarProductos, setOpenDialogAgregarProductos] = useState(false);

  return (
    <>
      <CotizacionProductosAgregarDialog
        cotizacion={cotizacion}
        open={openDialogAgregarProductos}
        setOpen={setOpenDialogAgregarProductos}
        handleGetCotizacion={handleGetCotizacion}
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
          {cotizacion?.productos_cotizados?.length > 0 && (
            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {cotizacion?.productos_cotizados.map((producto_cotizacion, index) => (
                <CotizacionProductosRow
                  key={producto_cotizacion.id}
                  producto_cotizacion={producto_cotizacion}
                  handleGetCotizacion={handleGetCotizacion}
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

export default CotizacionProductos;
