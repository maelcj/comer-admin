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

import CotizacionRefaccionesRow from './cotizacion-refacciones-row';
import CotizacionRefaccionesAgregarDialog from './cotizacion-refacciones-agregar-dialog';

const CotizacionRefacciones = ({ cotizacion, handleGetCotizacion }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogAgregarRefacciones, setOpenDialogAgregarRefacciones] = useState(false);

  return (
    <>
      <CotizacionRefaccionesAgregarDialog
        cotizacion={cotizacion}
        open={openDialogAgregarRefacciones}
        setOpen={setOpenDialogAgregarRefacciones}
        handleGetCotizacion={handleGetCotizacion}
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
          {cotizacion?.refacciones_cotizadas?.length > 0 && (
            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              {cotizacion?.refacciones_cotizadas.map((refaccion_cotizacion, index) => (
                <CotizacionRefaccionesRow
                  key={refaccion_cotizacion.id}
                  refaccion_cotizacion={refaccion_cotizacion}
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

export default CotizacionRefacciones;
