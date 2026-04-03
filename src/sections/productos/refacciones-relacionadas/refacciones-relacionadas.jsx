'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { getRefaccionesRelacionadas } from 'src/actions/productos';

import { plusIcon } from 'src/components/icons';
import { toast } from 'src/components/snackbar';

import DialogAgregar from './dialog-agregar';
import RefaccionChip from './refaccion-relacionada-chip';

const RefaccionesRelacionadas = ({ producto }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogAgregar, setOpenDialogAgregar] = useState(false);
  const [refacciones, setRefacciones] = useState([]);

  const handleGetRefaccionesRelacionadas = async () => {
    setIsLoading(true);
    const res = await getRefaccionesRelacionadas(producto.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    setRefacciones(res);

    return null;
  };

  useEffect(() => {
    handleGetRefaccionesRelacionadas();
  }, [producto]);

  return (
    <>
      <DialogAgregar
        open={openDialogAgregar}
        setOpen={setOpenDialogAgregar}
        producto={producto}
        handleGetRefaccionesRelacionadas={handleGetRefaccionesRelacionadas}
      />
      <Card sx={{ mt: 2 }}>
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
          <Typography variant="h6">Refacciones relacionadas</Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {refacciones?.map((refaccion) => (
              <RefaccionChip
                key={refaccion.id}
                producto={producto}
                refaccion={refaccion}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleGetRefaccionesRelacionadas={handleGetRefaccionesRelacionadas}
              />
            ))}
            <Chip
              label="Agregar"
              onClick={() => {
                setOpenDialogAgregar(true);
              }}
              onDelete={() => {
                setOpenDialogAgregar(true);
              }}
              deleteIcon={plusIcon}
              color="primary"
              variant="outlined"
              sx={{ border: 'none' }}
            />
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default RefaccionesRelacionadas;
