import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { procesarMarcasTipoDeCambio } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import ProductosTipoCambioTabla from './productos-tipoCambio-tabla';

const ProductosTipoCambio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const tablaRef = useRef();

  const handleTablaRef = () => {
    tablaRef.current.fetchTableData();
  };

  const handleProcesarMarcasTipoDeCambio = async () => {
    setIsLoading(true);
    const res = await procesarMarcasTipoDeCambio();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleTablaRef();

    return toast.success(res.message);
  };

  return (
    <Card>
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Tipo de cambio
        </Typography>

        <LoadingButton
          type="submit"
          variant="outlined"
          color="primary"
          startIcon={<Iconify icon="streamline:arrow-reload-vertical-1-solid" />}
          loading={isLoading}
          loadingPosition="start"
          onClick={() => {
            handleProcesarMarcasTipoDeCambio();
          }}
        >
          Obtener marcas nuevas
        </LoadingButton>
      </Box>
      <ProductosTipoCambioTabla ref={tablaRef} />
    </Card>
  );
};

export default ProductosTipoCambio;
