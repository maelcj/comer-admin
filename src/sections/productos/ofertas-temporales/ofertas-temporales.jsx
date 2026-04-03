'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { getOfertasTemporales } from 'src/actions/productos';

import { plusIcon } from 'src/components/icons';
import { toast } from 'src/components/snackbar';

import OfertaChip from './oferta-chip';
import DialogCrear from './dialog-crear';

const OfertasTemporales = ({ producto, handleGetProducto }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogCrear, setOpenDialogCrear] = useState(false);
  const [ofertas, setOfertas] = useState([]);

  const handleGetOfertas = async () => {
    setIsLoading(true);
    const res = await getOfertasTemporales(producto.id);
    setIsLoading(false);

    if (!res) {
      toast.error('Error al cargar ofertas temporales');
      return;
    }

    setOfertas(res);
  };

  useEffect(() => {
    handleGetOfertas();
  }, [producto]);

  return (
    <>
      <DialogCrear
        open={openDialogCrear}
        setOpen={setOpenDialogCrear}
        producto={producto}
        handleGetOfertas={handleGetOfertas}
        handleGetProducto={handleGetProducto}
      />
      <Card>
        <Backdrop
          open={isLoading}
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: 'absolute',
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={{ p: 2, pb: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Ofertas temporales</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={plusIcon}
              onClick={() => setOpenDialogCrear(true)}
            >
              Agregar oferta
            </Button>
          </Stack>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              backgroundColor: 'background.neutral',
              minHeight: 60,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {ofertas.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No hay ofertas temporales configuradas
              </Typography>
            ) : (
              ofertas.map((oferta) => (
                <OfertaChip
                  key={oferta.id}
                  oferta={oferta}
                  handleGetOfertas={handleGetOfertas}
                  handleGetProducto={handleGetProducto}
                />
              ))
            )}
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default OfertasTemporales;
