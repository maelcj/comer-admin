import { useState } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { eliminarProductoSimilar, eliminarProductoRelacionado } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';

import { TablaProductosRelacionados } from './tabla-productos-relacionados';

const ProductosRelacionados = ({ producto, handleGetProducto }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEliminarProductoRelacionado = async (id_relacionado) => {
    setIsLoading(true);
    const res = await eliminarProductoRelacionado(id_relacionado);
    await handleGetProducto(producto.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleEliminarProductoSimilar = async (id_similar) => {
    setIsLoading(true);
    const res = await eliminarProductoSimilar(id_similar);
    await handleGetProducto(producto.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  return (
    <Card>
      <CardHeader title="Productos relacionados" sx={{ mb: 3 }} />

      <Divider />

      <TablaProductosRelacionados producto={producto} handleGetProducto={handleGetProducto} />

      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Productos relacionados</Typography>

          <Stack spacing={1} sx={{ mt: 2 }}>
            {producto?.productos_relacionados_manual?.map((relacionado) => (
              <LoadingButton
                key={relacionado.id}
                variant="soft"
                color="success"
                size="small"
                loading={isLoading}
                loadingPosition="start"
                onClick={() => {
                  handleEliminarProductoRelacionado(relacionado.id);
                }}
              >
                {relacionado.mpn}
              </LoadingButton>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Productos similares</Typography>

          <Stack spacing={1} sx={{ mt: 2 }}>
            {producto?.productos_similares?.map((similar) => (
              <LoadingButton
                key={similar.id}
                variant="soft"
                color="success"
                size="small"
                loading={isLoading}
                loadingPosition="start"
                onClick={() => {
                  handleEliminarProductoSimilar(similar.id);
                }}
              >
                {similar.mpn}
              </LoadingButton>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ProductosRelacionados;
