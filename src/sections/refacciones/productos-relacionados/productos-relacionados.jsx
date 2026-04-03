'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { getProductosRelacionados } from 'src/actions/refacciones';

import { plusIcon } from 'src/components/icons';
import { toast } from 'src/components/snackbar';

import DialogAgregar from './dialog-agregar';
import ProductoChip from './producto-relacionado-chip';

const ProductosRelacionados = ({ refaccion }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogAgregar, setOpenDialogAgregar] = useState(false);

  const [productos, setProductos] = useState([]);

  const handleGetProductosRelacionados = async () => {
    setIsLoading(true);
    const res = await getProductosRelacionados(refaccion.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    setProductos(res);

    return null;
  };

  useEffect(() => {
    handleGetProductosRelacionados();
  }, [refaccion]);

  return (
    <>
      <DialogAgregar
        open={openDialogAgregar}
        setOpen={setOpenDialogAgregar}
        refaccion={refaccion}
        handleGetProductosRelacionados={handleGetProductosRelacionados}
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
          <Typography variant="h6">Productos relacionados</Typography>
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
            {productos?.map((producto) => (
              <ProductoChip
                key={producto.id}
                producto={producto}
                refaccion={refaccion}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleGetProductosRelacionados={handleGetProductosRelacionados}
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

export default ProductosRelacionados;
