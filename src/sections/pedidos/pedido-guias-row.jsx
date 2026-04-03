'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

import { enviarGuia, eliminarGuia } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const PedidoGuiasRow = ({ guia, handleGetPedido, setIsLoading }) => {
  const handleEliminarGuia = async () => {
    setIsLoading(true);
    const res = await eliminarGuia(guia.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    await handleGetPedido();

    return toast.success(res.message);
  };

  const handleEnviarGuia = async () => {
    setIsLoading(true);
    const res = await enviarGuia(guia.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    await handleGetPedido();

    return toast.success(res.message);
  };

  return (
    <Stack key={guia.id} alignItems="flex-end" spacing={{ xs: 2, md: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 1 }} sx={{ width: 1 }}>
        <Box
          sx={{
            minWidth: { md: 100 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.1 }}>
            {guia.guia}
          </Typography>
        </Box>

        <Box
          sx={{
            minWidth: { md: 100 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.1 }}>
            {guia.paqueteria}
          </Typography>
        </Box>

        <Button
          size="small"
          color="warning"
          variant="outlined"
          startIcon={<Iconify icon="fa-regular:envelope" />}
          onClick={() => {
            handleEnviarGuia();
          }}
        >
          Enviar
        </Button>

        <Button
          size="small"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={() => {
            handleEliminarGuia();
          }}
        >
          Eliminar
        </Button>
      </Stack>
    </Stack>
  );
};

export default PedidoGuiasRow;
