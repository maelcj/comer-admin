import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { actualizarDescripcion } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const ProductoDescripcion = ({ producto }) => {
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDescripcion(producto.datos_producto.descripcion || '');
  }, [producto]);

  const handleActualizarDescripcion = async () => {
    setIsLoading(true);
    const res = await actualizarDescripcion(producto.id, descripcion);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  return (
    <Card>
      <CardHeader title="Descripción" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={descripcion}
          onChange={(event) => setDescripcion(event.target.value)}
        />
      </Stack>
      <Stack
        spacing={3}
        sx={{ px: 3, pb: 3 }}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <LoadingButton
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<Iconify icon="fa-solid:check" />}
          loading={isLoading}
          loadingPosition="start"
          onClick={() => {
            handleActualizarDescripcion();
          }}
        >
          Guardar
        </LoadingButton>
      </Stack>
    </Card>
  );
};

export default ProductoDescripcion;
