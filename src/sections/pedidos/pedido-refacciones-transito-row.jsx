'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

import { actualizarRefaccionTransito } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const PedidoRefaccionesTransitoRow = ({ refaccion_pedido, handleGetPedido, setIsLoading }) => {
  const [cantidad, setCantidad] = useState(0);
  const [enviadas, setEnviadas] = useState(0);
  const [entregadas, setEntregadas] = useState(0);

  useEffect(() => {
    setCantidad(refaccion_pedido.cantidad);
    setEnviadas(refaccion_pedido.enviadas);
    setEntregadas(refaccion_pedido.entregadas);
  }, [refaccion_pedido]);

  const handleActualizarRefaccionTransito = async () => {
    setIsLoading(true);
    const res = await actualizarRefaccionTransito(refaccion_pedido.id, enviadas, entregadas);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    await handleGetPedido();

    return toast.success(res.message);
  };

  return (
    <Stack key={refaccion_pedido.id} alignItems="flex-end" spacing={{ xs: 2, md: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 1 }} sx={{ width: 1 }}>
        <Box sx={{ width: { md: 360 } }}>
          <Typography variant="body2" sx={{ lineHeight: 1.1 }}>
            {refaccion_pedido.nombre}
          </Typography>
        </Box>

        <TextField
          disabled
          size="small"
          type="number"
          label="Cantidad"
          placeholder="0"
          value={cantidad}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: { md: 80 } }}
        />

        <TextField
          size="small"
          type="number"
          label="Enviadas"
          placeholder="0.00"
          value={enviadas}
          onChange={(e) => {
            setEnviadas(e.target.value);
          }}
          sx={{ minWidth: { md: 80 } }}
        />

        <TextField
          size="small"
          type="number"
          label="Entregadas"
          placeholder="0.00"
          value={entregadas}
          onChange={(e) => {
            setEntregadas(e.target.value);
          }}
          sx={{ minWidth: { md: 80 } }}
        />
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          color="success"
          variant="outlined"
          startIcon={<Iconify icon="fa-solid:check" />}
          onClick={() => {
            handleActualizarRefaccionTransito();
          }}
        >
          Guardar
        </Button>
      </Stack>
    </Stack>
  );
};

export default PedidoRefaccionesTransitoRow;
